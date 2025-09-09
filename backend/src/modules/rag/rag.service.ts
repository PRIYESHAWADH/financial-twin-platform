import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
// import { SentenceTransformer } from 'sentence-transformers';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RAGService {
  private readonly logger = new Logger(RAGService.name);
  private openai: OpenAI;
  private embeddingModel: any;
  private knowledgeBase: Map<string, any> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.initializeModels();
    this.loadKnowledgeBase();
  }

  private async initializeModels() {
    try {
      // Initialize OpenAI client
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');
      if (apiKey) {
        this.openai = new OpenAI({ apiKey });
        this.logger.log('OpenAI client initialized');
      }

      // Initialize local embedding model
      try {
        // This would load a local sentence transformer model
        // For now, we'll use a mock implementation
        this.embeddingModel = {
          encode: async (texts: string[]) => {
            // Mock embedding generation
            return texts.map(() => new Array(384).fill(0).map(() => Math.random()));
          }
        };
        this.logger.log('Local embedding model initialized');
      } catch (error) {
        this.logger.warn('Failed to load local embedding model, using mock');
        this.embeddingModel = {
          encode: async (texts: string[]) => {
            return texts.map(() => new Array(384).fill(0).map(() => Math.random()));
          }
        };
      }
    } catch (error) {
      this.logger.error('Failed to initialize models:', error);
    }
  }

  private async loadKnowledgeBase() {
    try {
      // Load Indian financial regulations and tax laws
      const knowledgeBasePath = path.join(process.cwd(), 'ml', 'data', 'documents');
      
      if (fs.existsSync(knowledgeBasePath)) {
        const files = fs.readdirSync(knowledgeBasePath);
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(knowledgeBasePath, file), 'utf-8');
            const chunks = this.chunkText(content, 1000, 200);
            
            for (let i = 0; i < chunks.length; i++) {
              const chunkId = `${file}_chunk_${i}`;
              this.knowledgeBase.set(chunkId, {
                id: chunkId,
                content: chunks[i],
                source: file,
                chunkIndex: i,
                metadata: {
                  title: this.extractTitle(content),
                  section: this.extractSection(chunks[i]),
                  type: 'regulation',
                }
              });
            }
          }
        }
        
        this.logger.log(`Loaded ${this.knowledgeBase.size} knowledge base chunks`);
      }
    } catch (error) {
      this.logger.error('Failed to load knowledge base:', error);
    }
  }

  async indexFinancialData(financialDataId: string, processedData: any): Promise<void> {
    try {
      this.logger.log(`Indexing financial data: ${financialDataId}`);

      // Extract text content from processed data
      const textContent = this.extractTextFromFinancialData(processedData);
      
      if (!textContent || textContent.length === 0) {
        this.logger.warn(`No text content found for financial data: ${financialDataId}`);
        return;
      }

      // Chunk the text content
      const chunks = this.chunkText(textContent, 500, 100);
      
      // Generate embeddings for each chunk
      const embeddings = await this.embeddingModel.encode(chunks);
      
      // Store in vector database (pgvector)
      for (let i = 0; i < chunks.length; i++) {
        await this.storeVectorEmbedding({
          id: `${financialDataId}_chunk_${i}`,
          content: chunks[i],
          embedding: embeddings[i],
          metadata: {
            financialDataId,
            chunkIndex: i,
            dataType: processedData.source || 'unknown',
            userId: processedData.userId,
            createdAt: new Date().toISOString(),
          }
        });
      }

      this.logger.log(`Successfully indexed ${chunks.length} chunks for financial data: ${financialDataId}`);
    } catch (error) {
      this.logger.error(`Failed to index financial data ${financialDataId}:`, error);
      throw error;
    }
  }

  async queryFinancialData(
    userId: string,
    query: string,
    dataTypes?: string[],
    limit: number = 5
  ): Promise<any[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.embeddingModel.encode([query]);
      
      // Search for similar vectors
      const similarVectors = await this.searchSimilarVectors(
        queryEmbedding[0],
        userId,
        dataTypes,
        limit
      );

      // Format results
      const results = similarVectors.map(vector => ({
        id: vector.id,
        content: vector.content,
        metadata: vector.metadata,
        similarity: vector.similarity,
        source: 'financial_data'
      }));

      return results;
    } catch (error) {
      this.logger.error('Failed to query financial data:', error);
      throw error;
    }
  }

  async queryKnowledgeBase(
    query: string,
    limit: number = 5
  ): Promise<any[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.embeddingModel.encode([query]);
      
      // Search knowledge base
      const results = [];
      for (const [id, chunk] of this.knowledgeBase) {
        const chunkEmbedding = await this.embeddingModel.encode([chunk.content]);
        const similarity = this.calculateCosineSimilarity(queryEmbedding[0], chunkEmbedding[0]);
        
        if (similarity > 0.7) { // Threshold for relevance
          results.push({
            id: chunk.id,
            content: chunk.content,
            metadata: chunk.metadata,
            similarity,
            source: 'knowledge_base'
          });
        }
      }

      // Sort by similarity and limit results
      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error) {
      this.logger.error('Failed to query knowledge base:', error);
      throw error;
    }
  }

  async generateAIResponse(
    userId: string,
    query: string,
    context: any[] = []
  ): Promise<{
    response: string;
    citations: any[];
    confidence: number;
    sources: string[];
  }> {
    try {
      // Search for relevant context
      const financialContext = await this.queryFinancialData(userId, query);
      const knowledgeContext = await this.queryKnowledgeBase(query);
      
      // Combine contexts
      const allContext = [...financialContext, ...knowledgeContext, ...context];
      
      // Sort by relevance
      allContext.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
      
      // Take top 10 most relevant contexts
      const relevantContext = allContext.slice(0, 10);
      
      // Generate response using LLM
      const response = await this.generateLLMResponse(query, relevantContext);
      
      // Extract citations
      const citations = this.extractCitations(response, relevantContext);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(relevantContext, response);
      
      // Extract sources
      const sources = [...new Set(relevantContext.map(c => c.source))];
      
      return {
        response,
        citations,
        confidence,
        sources
      };
    } catch (error) {
      this.logger.error('Failed to generate AI response:', error);
      throw error;
    }
  }

  private async generateLLMResponse(query: string, context: any[]): Promise<string> {
    try {
      if (!this.openai) {
        // Fallback to rule-based response
        return this.generateRuleBasedResponse(query, context);
      }

      const systemPrompt = `You are an AI Financial Twin assistant specialized in Indian financial regulations and tax laws. 
      You help users understand their financial data and provide accurate, compliant advice.
      
      Guidelines:
      1. Always cite specific sections of Indian laws when providing tax advice
      2. Be precise and factual
      3. If you're unsure, say so
      4. Focus on Indian financial regulations (Income Tax Act, GST Act, etc.)
      5. Provide actionable insights based on the user's financial data`;

      const contextText = context.map(c => 
        `Source: ${c.source}\nContent: ${c.content}\nRelevance: ${c.similarity || 'N/A'}`
      ).join('\n\n');

      const userPrompt = `Query: ${query}

Context:
${contextText}

Please provide a helpful response based on the context above. Include specific citations where applicable.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      this.logger.error('Failed to generate LLM response:', error);
      return this.generateRuleBasedResponse(query, context);
    }
  }

  private generateRuleBasedResponse(query: string, context: any[]): string {
    // Simple rule-based response generation
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('tax') && queryLower.includes('deduction')) {
      return `Based on your financial data, you may be eligible for various tax deductions under the Income Tax Act, 1961. 
      Common deductions include Section 80C (up to ₹1.5 lakh), Section 80D (health insurance), and Section 24 (home loan interest). 
      Please consult with a qualified CA for personalized advice.`;
    }
    
    if (queryLower.includes('gst') && queryLower.includes('input')) {
      return `GST Input Tax Credit (ITC) is available under Section 16 of the CGST Act, 2017. 
      You can claim ITC on goods and services used for business purposes, subject to certain conditions and restrictions. 
      Some items like food, beverages, and personal use items are blocked from ITC under Section 17(5).`;
    }
    
    if (queryLower.includes('investment') && queryLower.includes('advice')) {
      return `Based on your financial profile, consider diversifying your investments across different asset classes. 
      ELSS funds under Section 80C offer tax benefits, while equity investments can provide long-term growth. 
      Please consult with a SEBI-registered investment advisor for personalized recommendations.`;
    }
    
    return `I understand you're asking about: "${query}". Based on the available context, I recommend consulting with a qualified financial advisor for personalized advice. 
    For general information about Indian tax laws and financial regulations, please refer to the official government websites.`;
  }

  private extractCitations(response: string, context: any[]): any[] {
    const citations = [];
    
    for (const ctx of context) {
      if (ctx.metadata?.section || ctx.metadata?.title) {
        citations.push({
          id: ctx.id,
          title: ctx.metadata.title || 'Financial Data',
          section: ctx.metadata.section || 'General',
          source: ctx.source,
          relevance: ctx.similarity || 0
        });
      }
    }
    
    return citations;
  }

  private calculateConfidence(context: any[], response: string): number {
    if (context.length === 0) return 0.1;
    
    const avgSimilarity = context.reduce((sum, c) => sum + (c.similarity || 0), 0) / context.length;
    const contextRelevance = Math.min(avgSimilarity * 1.2, 1.0);
    
    // Adjust based on response quality indicators
    let qualityScore = 0.5;
    if (response.includes('Section') || response.includes('Act')) qualityScore += 0.2;
    if (response.includes('₹') || response.includes('lakh')) qualityScore += 0.1;
    if (response.length > 100) qualityScore += 0.1;
    
    return Math.min(contextRelevance * qualityScore, 0.95);
  }

  private async storeVectorEmbedding(embeddingData: any): Promise<void> {
    try {
      // Store in pgvector database
      await this.prisma.$executeRaw`
        INSERT INTO vector_embeddings (id, content, embedding, metadata, created_at)
        VALUES (${embeddingData.id}, ${embeddingData.content}, ${JSON.stringify(embeddingData.embedding)}::vector, ${JSON.stringify(embeddingData.metadata)}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          content = EXCLUDED.content,
          embedding = EXCLUDED.embedding,
          metadata = EXCLUDED.metadata,
          updated_at = NOW()
      `;
    } catch (error) {
      this.logger.error('Failed to store vector embedding:', error);
      // Fallback to regular database storage
      await this.prisma.vectorEmbedding.upsert({
        where: { id: embeddingData.id },
        update: {
          content: embeddingData.content,
          embedding: embeddingData.embedding,
          metadata: embeddingData.metadata,
        },
        create: {
          id: embeddingData.id,
          content: embeddingData.content,
          embedding: embeddingData.embedding,
          metadata: embeddingData.metadata,
        },
      });
    }
  }

  private async searchSimilarVectors(
    queryEmbedding: number[],
    userId: string,
    dataTypes?: string[],
    limit: number = 5
  ): Promise<any[]> {
    try {
      // Search using pgvector similarity
      const results = await this.prisma.$queryRaw`
        SELECT id, content, metadata, 
               (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as distance,
               (1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector)) as similarity
        FROM vector_embeddings
        WHERE metadata->>'userId' = ${userId}
        ${dataTypes ? `AND metadata->>'dataType' = ANY(${dataTypes})` : ''}
        ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
        LIMIT ${limit}
      `;
      
      return results as any[];
    } catch (error) {
      this.logger.error('Failed to search similar vectors:', error);
      return [];
    }
  }

  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private extractTextFromFinancialData(processedData: any): string {
    let text = '';
    
    if (processedData.transactions) {
      text += processedData.transactions.map((t: any) => 
        `${t.description || t.narration || 'Transaction'}: ${t.amount || 0} on ${t.date || t.transactionDate || 'Unknown date'}`
      ).join('\n');
    }
    
    if (processedData.accounts) {
      text += processedData.accounts.map((a: any) => 
        `Account: ${a.accountNumber || a.accountId || 'Unknown'} - Balance: ${a.balance || 0}`
      ).join('\n');
    }
    
    if (processedData.holdings) {
      text += processedData.holdings.map((h: any) => 
        `Holding: ${h.name || h.symbol || 'Unknown'} - Value: ${h.value || h.amount || 0}`
      ).join('\n');
    }
    
    if (processedData.text) {
      text += processedData.text;
    }
    
    return text;
  }

  private chunkText(text: string, maxChunkSize: number, overlap: number): string[] {
    const chunks = [];
    let start = 0;
    
    while (start < text.length) {
      const end = Math.min(start + maxChunkSize, text.length);
      let chunk = text.slice(start, end);
      
      // Try to break at sentence boundary
      if (end < text.length) {
        const lastSentence = chunk.lastIndexOf('.');
        if (lastSentence > start + maxChunkSize * 0.5) {
          chunk = chunk.slice(0, lastSentence + 1);
        }
      }
      
      chunks.push(chunk.trim());
      start = end - overlap;
    }
    
    return chunks.filter(chunk => chunk.length > 0);
  }

  private extractTitle(content: string): string {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('# ')) {
        return line.substring(2).trim();
      }
    }
    return 'Financial Regulation';
  }

  private extractSection(chunk: string): string {
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.includes('Section') || line.includes('सेवा')) {
        return line.trim();
      }
    }
    return 'General';
  }
}
