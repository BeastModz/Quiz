/**
 * OpenAI Integration for Quiz App
 * Provides AI-powered answer evaluation and feedback
 */

class OpenAIIntegration {
    constructor() {
        // Load API key from localStorage (set via admin panel)
        this.apiKey = localStorage.getItem('openai_api_key') || '';
        this.enabled = localStorage.getItem('openai_enabled') === 'true';
        this.model = localStorage.getItem('openai_model') || 'gpt-3.5-turbo';
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
    }

    /**
     * Check if OpenAI integration is properly configured
     */
    isConfigured() {
        return this.enabled && this.apiKey && this.apiKey.length > 0;
    }

    /**
     * Enable/disable OpenAI integration
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        localStorage.setItem('openai_enabled', enabled.toString());
    }

    /**
     * Set OpenAI API key
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('openai_api_key', apiKey);
    }

    /**
     * Set OpenAI model
     */
    setModel(model) {
        this.model = model;
        localStorage.setItem('openai_model', model);
    }

    /**
     * Test the API connection
     */
    async testConnection() {
        if (!this.apiKey) {
            return { success: false, error: 'API key not set' };
        }

        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'user', content: 'Test connection - respond with OK' }
                    ],
                    max_tokens: 10
                })
            });

            if (!response.ok) {
                const error = await response.json();
                return { success: false, error: error.error?.message || 'API request failed' };
            }

            return { success: true, message: 'Connection successful!' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Evaluate a student's answer using AI
     * 
     * @param {Object} question - The question object
     * @param {number} selectedAnswer - Index of selected answer
     * @param {number} correctAnswer - Index of correct answer
     * @returns {Promise<Object>} AI evaluation result
     */
    async evaluateAnswer(question, selectedAnswer, correctAnswer) {
        if (!this.isConfigured()) {
            return null;
        }

        const selectedOption = question.options[selectedAnswer];
        const correctOption = question.options[correctAnswer];

        const prompt = `You are an expert tutor helping a student understand why their answer was incorrect.

Question: ${question.question}

Correct Answer: ${String.fromCharCode(65 + correctAnswer)}. ${correctOption}
Student's Answer: ${String.fromCharCode(65 + selectedAnswer)}. ${selectedOption}

Please provide:
1. A brief explanation of why the correct answer is right
2. Why the student's answer is incorrect
3. A helpful tip to remember the correct concept

Keep your response concise, educational, and encouraging. Format in 3 clear paragraphs.`;

        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful, encouraging tutor specializing in anatomy, physiology, and human dynamics. Provide clear, concise explanations.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('OpenAI API error:', error);
                return null;
            }

            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content || '';

            return {
                success: true,
                explanation: aiResponse,
                model: this.model
            };
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return null;
        }
    }

    /**
     * Get a personalized study suggestion based on missed questions
     * 
     * @param {Array} missedQuestions - Array of question objects that were answered incorrectly
     * @returns {Promise<Object>} Study suggestions
     */
    async getStudySuggestions(missedQuestions) {
        if (!this.isConfigured() || missedQuestions.length === 0) {
            return null;
        }

        // Extract topics from missed questions
        const topics = missedQuestions.map(q => {
            if (q.textbookReference) {
                return `${q.textbookReference.chapter}: ${q.textbookReference.section}`;
            }
            return q.question.substring(0, 50) + '...';
        }).slice(0, 10); // Limit to 10 topics

        const prompt = `Based on these topics a student struggled with:

${topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Provide 3 personalized study recommendations:
1. A prioritized study plan
2. Key concepts to review
3. Study techniques that would help

Keep it concise and actionable.`;

        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a study advisor helping students create effective study plans.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 400,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                console.error('OpenAI API error');
                return null;
            }

            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content || '';

            return {
                success: true,
                suggestions: aiResponse
            };
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return null;
        }
    }
}

// Export for use in quiz app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenAIIntegration;
}
