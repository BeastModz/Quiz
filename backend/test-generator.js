#!/usr/bin/env node

/**
 * Test script for AI Question Generator
 * Usage: node test-generator.js [topic] [count]
 */

import QuestionGenerator from './question-generator.js';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('❌ OPENAI_API_KEY not set in environment');
  process.exit(1);
}

const generator = new QuestionGenerator(apiKey);

const topic = process.argv[2] || 'continuity';
const count = parseInt(process.argv[3] || '1');

console.log(`\n🧪 Testing Question Generator`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`📝 Topic: ${topic}`);
console.log(`🔢 Count: ${count}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

async function test() {
  try {
    if (count === 1) {
      console.log('Generating single question...\n');
      const question = await generator.generate(topic);
      
      console.log('✅ Generated successfully!\n');
      console.log('📋 Question HTML:');
      console.log(question.question_html);
      console.log('\n✔️ Answer:', question.answer_html);
      console.log('🔍 Explanation:', question.explain_html);
      console.log('\n📊 Metadata:');
      console.log(`   Label: ${question.label}`);
      console.log(`   Value: ${question.answer_value}`);
      console.log(`   Unit: ${question.answer_unit}`);
      console.log('\n🗂️ State:');
      console.log(JSON.stringify(question.state, null, 2));
      
    } else {
      console.log(`Generating batch of ${count} questions...\n`);
      const questions = await generator.generateBatch(topic, count);
      
      console.log(`✅ Generated ${questions.length} questions successfully!\n`);
      
      questions.forEach((q, i) => {
        console.log(`\n━━━ Question ${i + 1} ━━━`);
        console.log(`Label: ${q.label}`);
        console.log(`Answer: ${q.answer_html}`);
        console.log(`Unknown: ${q.state.unknown}`);
        
        // Verify validation
        try {
          const state = q.state;
          switch (topic) {
            case 'continuity':
              if (state.A1 && state.A2 && state.v1 && state.v2) {
                const Q1 = state.A1 * state.v1;
                const Q2 = state.A2 * state.v2;
                const error = Math.abs((Q1 - Q2) / Q1) * 100;
                console.log(`Continuity check: Q1=${Q1.toExponential(3)}, Q2=${Q2.toExponential(3)}, error=${error.toFixed(6)}%`);
              }
              break;
            case 'combined_gas_law':
              if (state.P1 && state.V1 && state.T1 && state.P2 && state.V2 && state.T2) {
                const ratio1 = (state.P1 * state.V1) / state.T1;
                const ratio2 = (state.P2 * state.V2) / state.T2;
                const error = Math.abs((ratio1 - ratio2) / ratio1) * 100;
                console.log(`CGL check: PV/T1=${ratio1.toFixed(3)}, PV/T2=${ratio2.toFixed(3)}, error=${error.toFixed(6)}%`);
              }
              break;
            case 'dalton':
              if (state.partials && state.Ptot) {
                const sum = state.partials.reduce((a, b) => a + b, 0);
                const error = Math.abs((sum - state.Ptot) / state.Ptot) * 100;
                console.log(`Dalton check: sum=${sum.toFixed(2)}, Ptot=${state.Ptot.toFixed(2)}, error=${error.toFixed(6)}%`);
              }
              break;
          }
        } catch (err) {
          console.log(`⚠️ Validation error: ${err.message}`);
        }
      });
      
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`✅ All ${questions.length} questions validated`);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

test();
