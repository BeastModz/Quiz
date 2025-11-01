/**
 * Ollama Integration for Quiz App
 * 
 * This module provides AI-powered answer evaluation using Ollama
 * local models (e.g., llama2, mistral, etc.)
 */

class OllamaService {
    constructor() {
        this.baseUrl = 'http://localhost:11434';
        this.model = 'llama2'; // Default model, can be changed
        this.enabled = false;
        this.available = false;
        
        // Check if Ollama is available
        this.checkAvailability();
    }
    
    async checkAvailability() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            if (response.ok) {
                const data = await response.json();
                this.available = true;
                console.log('✓ Ollama is available with models:', data.models?.map(m => m.name));
                return true;
            }
        } catch (error) {
            console.log('ℹ Ollama is not available. Install from https://ollama.ai to enable AI features.');
            this.available = false;
        }
        return false;
    }
    
    async getAvailableModels() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            if (response.ok) {
                const data = await response.json();
                return data.models || [];
            }
        } catch (error) {
            console.error('Error fetching models:', error);
        }
        return [];
    }
    
    async evaluateAnswer(question, userAnswer, correctAnswer, options) {
        if (!this.enabled || !this.available) {
            return null;
        }
        
        const prompt = `You are evaluating a student's answer to a multiple-choice quiz question.

Question: ${question}

Options:
${options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n')}

Correct Answer: ${correctAnswer}
Student Selected: ${userAnswer}

Task: Provide a brief (2-3 sentences) evaluation explaining why the student's answer is ${userAnswer === correctAnswer ? 'correct' : 'incorrect'}. If incorrect, explain the key concept they missed.

Keep it educational and encouraging.`;

        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        num_predict: 150 // Limit response length
                    }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.response;
            }
        } catch (error) {
            console.error('Error evaluating answer:', error);
        }
        
        return null;
    }
    
    async enhanceExplanation(question, correctAnswer, basicExplanation) {
        if (!this.enabled || !this.available) {
            return basicExplanation;
        }
        
        const prompt = `You are helping a student understand a quiz question better.

Question: ${question}
Correct Answer: ${correctAnswer}
Basic Explanation: ${basicExplanation || 'No explanation provided'}

Task: Provide a clear, concise explanation (3-4 sentences) that:
1. Confirms why the answer is correct
2. Explains the key concept or mechanism
3. Adds one practical example or memory aid

Keep it educational and easy to understand.`;

        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.8,
                        num_predict: 200
                    }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.response;
            }
        } catch (error) {
            console.error('Error enhancing explanation:', error);
        }
        
        return basicExplanation;
    }
    
    async generateStudyTip(topic, difficulty = 'medium') {
        if (!this.enabled || !this.available) {
            return null;
        }
        
        const prompt = `Generate a quick study tip for the topic: "${topic}"

Difficulty level: ${difficulty}

Provide ONE practical study tip or mnemonic device (1-2 sentences) that would help a student remember this concept.

Be specific and actionable.`;

        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.9,
                        num_predict: 100
                    }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.response;
            }
        } catch (error) {
            console.error('Error generating study tip:', error);
        }
        
        return null;
    }
    
    setModel(modelName) {
        this.model = modelName;
        console.log(`Ollama model set to: ${modelName}`);
    }
    
    enable() {
        if (this.available) {
            this.enabled = true;
            console.log('✓ Ollama AI features enabled');
            return true;
        }
        console.warn('Cannot enable Ollama - not available');
        return false;
    }
    
    disable() {
        this.enabled = false;
        console.log('Ollama AI features disabled');
    }
    
    isEnabled() {
        return this.enabled && this.available;
    }
    
    isAvailable() {
        return this.available;
    }
}

// Export for use in quiz app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OllamaService;
}
