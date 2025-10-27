<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Practice</title>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
            min-height: 100vh;
        }
        
        .header {
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid #e5e7eb;
        }
        
        .header-content {
            max-width: 1024px;
            margin: 0 auto;
            padding: 1rem;
        }
        
        .header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #1f2937;
        }
        
        .header-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .dataset-select {
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            background: #f3f4f6;
            color: #1f2937;
            border: 1px solid #d1d5db;
        }
        
        .restart-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: #f3f4f6;
            color: #374151;
            border-radius: 0.5rem;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .restart-btn:hover {
            background: #e5e7eb;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .stat-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .stat-content {
            font-size: 0.875rem;
        }
        
        .stat-value {
            font-weight: 600;
            color: #1f2937;
        }
        
        .stat-label {
            font-size: 0.75rem;
            color: #6b7280;
        }
        
        .progress-bar {
            margin-top: 1rem;
            background: #e5e7eb;
            border-radius: 9999px;
            height: 0.5rem;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(to right, #3b82f6, #4f46e5);
            transition: width 0.5s ease-out;
            width: 0%;
        }
        
        .main-content {
            max-width: 1024px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }
        
        .retry-notice {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 0.5rem;
            color: #92400e;
        }
        
        .question-card {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            padding: 2rem;
        }
        
        .question-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
        }
        
        .subject-badge {
            padding: 0.25rem 0.75rem;
            background: #dbeafe;
            color: #1d4ed8;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .question-counter {
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        .question-text {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        
        .options-container {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .option-button {
            width: 100%;
            text-align: left;
            padding: 1rem;
            border-radius: 0.75rem;
            border: 2px solid #e5e7eb;
            background: #f9fafb;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 1rem;
        }
        
        .option-button:hover:not(:disabled) {
            transform: scale(1.02);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-color: #60a5fa;
        }
        
        .option-button:disabled {
            cursor: default;
        }
        
        .option-button.selected {
            background: #dbeafe;
            border-color: #3b82f6;
        }
        
        .option-button.correct {
            background: #dcfce7;
            border-color: #10b981;
            animation: pulse 1s infinite;
        }
        
        .option-button.incorrect {
            background: #fee2e2;
            border-color: #ef4444;
            animation: shake 0.5s ease-out;
        }
        
        .option-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .option-text {
            color: #1f2937;
            font-weight: 500;
        }
        
        .option-icon {
            width: 1.5rem;
            height: 1.5rem;
            animation: scaleIn 0.3s ease-out;
        }
        
        .feedback-section {
            margin-top: 1.5rem;
            padding: 1rem;
            border-radius: 0.75rem;
            animation: slideDown 0.3s ease-out;
        }
        
        .feedback-correct {
            background: #dcfce7;
            border: 1px solid #bbf7d0;
        }
        
        .feedback-explanation {
            background: #dbeafe;
            border: 1px solid #bfdbfe;
        }
        
        .feedback-content {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }
        
        .feedback-icon-wrapper {
            margin-top: 0.25rem;
            padding: 0.25rem;
            border-radius: 50%;
        }
        
        .feedback-icon-correct {
            background: #bbf7d0;
        }
        
        .feedback-icon-explanation {
            background: #bfdbfe;
        }
        
        .feedback-text {
            flex: 1;
        }
        
        .feedback-title {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .feedback-title-correct {
            color: #059669;
        }
        
        .feedback-title-explanation {
            color: #1d4ed8;
        }
        
        .feedback-description {
            color: #4b5563;
            font-size: 0.875rem;
        }
        
        .next-button-container {
            margin-top: 1.5rem;
            display: flex;
            justify-content: flex-end;
        }
        
        .next-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(to right, #3b82f6, #4f46e5);
            color: white;
            border-radius: 0.75rem;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            animation: fadeIn 0.5s ease-out;
        }
        
        .next-button:hover {
            background: linear-gradient(to right, #2563eb, #4338ca);
        }
        
        .completion-screen {
            text-align: center;
            padding: 3rem 2rem;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .completion-title {
            font-size: 2rem;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 1rem;
        }
        
        .completion-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .completion-stat {
            padding: 1rem;
            background: #f9fafb;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
        }
        
        .completion-stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #3b82f6;
        }
        
        .completion-stat-label {
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div id="app">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="header-top">
                    <h1 class="title">Quiz Practice</h1>
                    <div class="header-controls">
                        <select id="datasetSelect" class="dataset-select">
                            <option value="Exam 1">Exam 1</option>
                            <option value="Exam 2">Exam 2</option>
                            <option value="Both">Both</option>
                        </select>
                        <button id="restartBtn" class="restart-btn">
                            <i data-lucide="rotate-ccw"></i>
                            Restart
                        </button>
                    </div>
                </div>

                <!-- Stats -->
                <div class="stats-grid">
                    <div class="stat-item">
                        <i data-lucide="target" style="color: #3b82f6;"></i>
                        <div class="stat-content">
                            <div class="stat-value" id="questionStat">1/80</div>
                            <div class="stat-label" id="questionLabel">Question</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i data-lucide="trending-up" style="color: #10b981;"></i>
                        <div class="stat-content">
                            <div class="stat-value" id="progressStat">0%</div>
                            <div class="stat-label">Progress</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i data-lucide="award" style="color: #8b5cf6;"></i>
                        <div class="stat-content">
                            <div class="stat-value" id="accuracyStat">0.0%</div>
                            <div class="stat-label">Accuracy</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i data-lucide="rotate-ccw" style="color: #f59e0b;"></i>
                        <div class="stat-content">
                            <div class="stat-value" id="attemptStat">1</div>
                            <div class="stat-label">Attempts</div>
                        </div>
                    </div>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Retry Notice -->
            <div id="retryNotice" class="retry-notice hidden">
                Retry Mode: Answer the <span id="retryCount">0</span> question<span id="retryPlural">s</span> you got wrong
            </div>

            <!-- Question Card -->
            <div id="questionCard" class="question-card">
                <div class="question-header">
                    <span class="subject-badge" id="subjectBadge">Exam 1</span>
                    <span class="question-counter" id="questionCounter">Question 1 of 80</span>
                </div>

                <h2 class="question-text" id="questionText">Loading question...</h2>

                <div class="options-container" id="optionsContainer">
                    <!-- Options will be dynamically inserted here -->
                </div>

                <!-- Feedback Section -->
                <div id="feedbackSection" class="feedback-section hidden">
                    <div class="feedback-content">
                        <div class="feedback-icon-wrapper" id="feedbackIconWrapper">
                            <i id="feedbackIcon" class="option-icon"></i>
                        </div>
                        <div class="feedback-text">
                            <p class="feedback-title" id="feedbackTitle">Correct!</p>
                            <p class="feedback-description" id="feedbackDescription">—</p>
                        </div>
                    </div>
                </div>

                <!-- Next Button -->
                <div id="nextButtonContainer" class="next-button-container hidden">
                    <button id="nextButton" class="next-button">
                        <span id="nextButtonText">Next Question</span>
                        <i data-lucide="chevron-right"></i>
                    </button>
                </div>
            </div>

            <!-- Completion Screen -->
            <div id="completionScreen" class="completion-screen hidden">
                <h2 class="completion-title">Quiz Complete!</h2>
                <div class="completion-stats">
                    <div class="completion-stat">
                        <div class="completion-stat-value" id="finalProgress">100%</div>
                        <div class="completion-stat-label">Questions Mastered</div>
                    </div>
                    <div class="completion-stat">
                        <div class="completion-stat-value" id="finalAccuracy">85.5%</div>
                        <div class="completion-stat-label">Overall Accuracy</div>
                    </div>
                    <div class="completion-stat">
                        <div class="completion-stat-value" id="finalAttempts">2</div>
                        <div class="completion-stat-label">Total Attempts</div>
                    </div>
                </div>
                <button id="completionRestartBtn" class="next-button">
                    <i data-lucide="rotate-ccw"></i>
                    Start New Quiz
                </button>
            </div>
        </div>
    </div>

    <script>
        // Exam data
        const exam1Text = `
For each question choose the best answer from the options provided. 1p is awarded for each 
correct answer. 
 
1. Which of these physiological phenomena is an example of a POSITIVE feedback 
loop?? 
A. Blood clotting. 
B. Glycolysis in the liver. 
C. Hypothalamic regulation of urine production. 
D. Thyroidal regulation of metabolic rate. 
 
2. Which of the following is NOT an important role of water in the human body? 
A. Dissolution of lipids in cell membranes. 
B. Hydrolysis of organic polymers. 
C. Regulation of body temperature. 
D. Transport of nutrients around the body. 
 
3. Which of these physiological functions in NOT associated with the urinary system? 
A. Producing urine. 
B. Regulating blood pressure. 
C. Removing nitrogenous wastes from the body. 
D. Removing ethanol from the body. 
 
4. In which part of the nephron does blood filtration take place? 
A. In the convoluted tube. 
B. In the efferent arteriole. 
C. In the glomerulus.  
D. In the nephron loop. 
 
5. Some blood leukocytes are capable of phagocytosis. 
A. True. 
B. False. 
 
6. Which of these chemicals is NOT relevant for regulating blood pH levels? 
A. Carbonate ion (CO2-3). 
B. Carbon dioxide (CO2). 
C. Hydrogen ion (H+). 
D. Oxygen (O2). 
 
7. Which of these hormones is produced by the corpus luteum and prepares the 
endometrium for a possible pregnancy? 
A. Estrogen. 
B. Noradrenaline. 
C. Progesterone. 
D. Testosterone. 
 
8. Which of these is an example of a humoral stimuli regulating hormone release? 
A. High levels of thyroid stimulating hormone (TSH) cause the release of T3 in 
the thyroid. 
B. Low concentrations of calcium in the blood cause the release of parathyroid 
hormone (PTH) in the parathyroid glands.  
C. Testosterone released in the testes inhibits the release of follicle-stimulating 
hormone (FSH) and luteinizing hormone (LH) in the anterior pituitary gland. 
D. The thoracic splanchnic nerves stimulate the release of noradrenaline in the 
adrenal glands. 
 
9. Which of the following is NOT a function of the liver? 
A. Convert ammonium wastes into urea. 
B. Hydrolyze cancerous cells to avoid tumors. 
C. Metabolize ethanol into acetate that can be excreted in the urine. 
D. Synthesize glucose from fats and aminoacids. 
 
10. What is the LOWEST level of organization in our body? 
A. Cells. 
B. Organelles. 
C. Organs. 
D. Systems. 

11. Fill in the blank with one of the following option: The _________ is responsible for 
disposing of unwanted molecules in the cell. 
A. Golgi apparatus. 
B. Lysosome. 
C. Mitochondrion. 
D. Ribosome. 
 
12. In the movie Jurassic Park, the dinosaurs had a genetic mutation that made them unable 
to synthesize the aminoacid lysine. Assuming they didn’t get lysine from their diet, this 
means they would be UNABLE to synthesize which type of macromolecule? 
A. Carbohydrates. 
B. Lipids. 
C. Nucleic acids. 
D. Proteins. 
 
13. Which of the following sentences regarding urine formation is CORRECT? 
A. Blood filtration is powered by enzymes. 
B. During filtration, all proteins, sugars and ions are removed from the blood. 
C. Ions are reabsorbed in the convoluted tubule through active transport. 
D. Water is mostly reabsorbed in the distal part of the convoluted tubule. 
 
14. Which two organs are involved in the regulation of glucose levels in the blood? 
A. Adrenal glands and Thyroid. 
B. Pancreas and Liver. 
C. Parathyroid and Pancreas. 
D. Thyroid and Parathyroid. 
 
15. An animal exposed to cold weather conditions is likely to have which of the following? 
A. High levels of insulin in the blood. 
B. High levels of thyroid hormones in the blood. 
C. Low levels of oxytocin in the blood. 
D. Low levels of testosterone in the blood. 
 
16. The figure below shows the results of an experiment where human red blood cells were 
exposed to three saline solutions with different concentrations. Given the behavior of 
the cells (upper panel) and the movement of water across their membranes (lower 
panel), which of these statements is FALSE? 
A. Solution A has the lowest salt concentration. 
B. Solution B has a salt concentration similar to that of human blood. 
C. The green arrows represent water movement by osmosis. 
D. The yellow arrows represent water movement by osmosis. 
 
17. What is the cytosol? 
A. A cellular organelle responsible for packaging proteins for extracellular 
transport. 
B. A lipid responsible for transducing hormonal signals inside living cells. 
C. The fluid component of the cell, within which various organelles and particles 
are suspended. 
D. The material or protoplasm found within living cells, between the membrane 
and the nucleus. 
 
18. Where does hematopoiesis takes place? 
A. In the bone marrow. 
B. In the kidneys. 
C. In the liver. 
D. In the pancreas. 
 
19. Look at the picture below showing the main organs of the endocrine system. Which 
organs do numbers 1, 2, 3 and 4 correspond to? 
A. 1 – Pancreas; 2 – Adrenal gland; 3 – Liver; 4 – Kidney. 
B. 1 – Parathyroid gland; 2 – Thyroid gland; 3 – Liver; 4 - Testes. 
C. 1 – Thyroid gland; 2 – Adrenal gland; 3 – Pancreas; 4 - Testes. 
D. 1 – Thyroid gland; 2 – Parathyroid gland; 3 – Pancreas; 4 - Testes. 
 
20. Which of the following hormones is produced in the islets of Langerhans? 
A. Aldosterone. 
B. Insulin. 
C. Renin. 
D. Thyroxine (T4). 
 
21. As part of the monitoring of impacts caused by gas-drilling induced earthquakes in the 
province of Groningen, you were asked to measure the effect of these earthquakes on 
the long-term stress response of people living in the affected areas. Which of these 
hormones would you measure in those people? 
A. Aldosterone. 
B. Cortisone. 
C. Glucagon. 
D. Thyroxine (T4). 
 
22. What is the urethra? 
A. A circular muscle that regulates the flow of urine into the outside of the body. 
B. An expandable sac that accumulates urine produced in the kidneys. 
C. A tube that carries urine from the kidneys to the urinary bladder. 
D. A tube that carries urine from the urinary bladder to the outside of the body. 
 
23. What is the main characteristic of passive membrane transport across the cell 
membrane? 
A. Protein channels are always necessary. 
B. It requires ATP to be consumed. 
C. Solutes move from higher to lower concentration. 
D. Solutes move from lower to higher concentration. 
 
24. Which of these blood components carries cholesterol to the liver? 
A. Erythrocytes. 
B. High-density lipoproteins (HDL). 
C. Leukocytes. 
D. Platelets. 
 
25. The glomerular filtrate is the result of blood filtration in the kidneys, but not yet urine. 
Which of the following differences between glomerular filtrate and urine is FALSE? 
A. In healthy individuals, only the glomerular filtrate contains glucose. 
B. The body produced roughly 100x more glomerular filtrate than urine. 
C. Urine has a lower pH than the glomerular filtrate. 
D. Urine has more salt than the glomerular filtrate. 
 
26. Which of the following is an example of pinocytosis? 
A. Detection of insulin by protein receptors in the membrane of muscle cells. 
B. Diffusion of oxygen across the plasma membrane of red blood cells in the 
pulmonary alveoli. 
C. Ingestion of bacteria by neutrophil leukocytes during an infectious process. 
D. The uptake of extracellular fluids containing nutrients by cells of the intestinal 
wall. 
 
27. What will the liver do in the presence of glucagon? 
A. Break down glycogen to release glucose. 
B. Break down cholesterol to release fatty acids. 
C. Break down complex fats for storage. 
D. Synthesize aminoacids necessary for the production of new proteins. 
 
28. Which of the following statements about sickle cell anemia is TRUE? 
A. Patients with this disease show reduced oxygen transport in blood. 
B. The erythrocytes of the patient become biconcave. 
C. The disease is caused by the same mosquito that carries malaria. 
D. This disease is most common is people with Asian descent. 
 
29. Which of the following sentences regarding kidney anatomy is TRUE? 
A. The nephrons are fully contained in the renal medula. 
B. The outer lining of the kidney is known are renal cortex. 
C. The renal pelvis collects the urine draining from the collecting ducts. 
D. The thinner part of the kidney, where blood vessels go in and out, is called the 
renal pyramid. 
 
30. In which situation will the kidney produce the hormone renin? 
A. When bacteria are present in the urine. 
B. When blood pressure in the afferent arteriole is low. 
C. When blood pressure in the efferent arteriole is high. 
D. When glucose is present in the urine. 
 
31. What happens after a person is inoculated with a smallpox vaccine? 
A. The immune system starts producing leukocytes capable of fighting smallpox. 
B. The immune system starts producing smallpox specific antibodies. 
C. The immune system starts producing unspecific antibodies. 
D. Nothing. Vaccines are a conspiracy designed by big pharmaceutical companies 
for immediate profit. 
 
32. Which of these condition is characterized by the production of abnormal white blood 
cells? 
A. Anemia. 
B. Hemophilia. 
C. Leukemia. 
D. Leukocytis. 
 
33. Some aminoacids can only be obtained from food, while others can be synthesized in 
the human body. Which organ is responsible for aminoacid synthesis in humans? 
A. Kidney. 
B. Liver. 
C. Pancreas. 
D. Thyroid gland. 
 
34. Which of these sentences regarding hormone action is TRUE? 
A. Hormones are produced in specific tissues called target tissues. 
B. Hormones are detected by specific phospholipidic receptors in plasma 
membranes. 
C. Hormones have no significant effect of DNA and gene expression. 
D. Non-steroid hormones require a second messenger to carry their signal inside 
the cells. 
 
35. Which of these physiological processes involves the oxidation of iron atoms? 
A. Blood clotting. 
B. Phagocytosis. 
C. Transport of glucose across the plasma membrane. 
D. Transport of oxygen in the blood. 
 
36. Which of the following sentences about the plasma membrane is TRUE? 
A. All transport proteins require ATP to carry substances across the membrane. 
B. Glycolipids form the basic structure of the plasma membrane. 
C. Oxygen can diffuse across the membrane. 
D. Muscle cells have no plasma membrane to allow for a faster intake of glucose. 
 
37. Which of the following processes causes a DECREASE in blood pressure? 
A. Reduced water reabsorption in the nephrons. 
B. Release of renin in the kidney. 
C. Release of aldosterone in the adrenal glands. 
D. Vasoconstriction (narrowing of the blood vessels). 
 
38. Which of these components is NOT found in healthy urine? 
A. Bicarbonate ion. 
B. Hemoglobin. 
C. Urea. 
D. Water. 
 
39. Which of the following substances is NOT commonly found in blood plasma? 
A. Carbon dioxide. 
B. Collagen. 
C. Glucose. 
D. Urea. 
 
40. There are three chemical types of hormones. Which are they? 
A. Aminoacid-based, Nucleotide-based and Steroids. 
B. Aminoacid-based, Fatty acid derivatives and Steroids. 
C. Nuceotide-based, Fatty acid derivatives and Steroids. 
D. Steroids, Glicocorticoids and Fatty acid derivatives. 
 
41. Sarcomeres are the functional units of the muscle.  
A. True. 
B. False 
 
42. A fasciculus is made up of fibres. 
A. True. 
B. False. 
 
43. In a contraction, the Z-lines (discs) can be further separated. 
A. True. 
B. False. 
 
44. Fill in the blank. Fine motor activities require _____ motor units. 
A. Large. 
B. Small. 
 
45. Fill in the blank. The Krebs cycle with oxidative phosphorylation produces ___ 
molecules of ATP per molecule of glucose. 
A. 1. 
B. 3. 
C. 36 
 
46. Lactate is formed by which metabolic process? 
A. Aerobic metabolism. 
B. Glycolysis. 
C. Splitting of creatine phosphate. 
 
47. Synergists are muscle that… 
A. Cause the same movement. 
B. Do not influence each other’s working. 
C. Work against each other. 
 
48. Anaerobic endurance is the capacity of muscles to perform for a short period of time 
under which conditions? 
A. Using oxygen stored in the cell. 
B. With insufficiently supplied oxygen. 
C. With sufficiently supplied oxygen. 
 
49. Which of the following options is TRUE below the anaerobic threshold? 
A. Large amounts of pyruvic acid are converted into lactate. 
B. The muscle contains insufficient O2 for energy supply. 
C. You can be in a steady state. 
 
50. Interval trainings cause the number of mitochondria to diminish. 
A. True. 
B. False. 
 
51. Lubrication, nutrition and strength distribution in a joint are a function of which 
structure? 
A. Cartilage. 
B. Periost. 
C. Synovia. 
 
52. The inner lining of the joint capsule is formed by which structure? 
A. Cartilage. 
B. Ligament. 
C. Synovial membrane. 
 
53. The figure below represents a joint. What type of articulation is it? 
A. Ellipsoidea. 
B. Ginglymus. 
C. Sellaris. 
 
54. A joint based on a link with connective tissue between two bones is called?  
A. Synchondrosis. 
B. Syndesmosis. 
C. Synostosis. 
 
55. Which of the following are capacity vessels? 
A. Arteries. 
B. Capillaries. 
C. Veins. 
 
56. How does transport over the capillary walls takes place? 
A. Only by diffusion. 
B. Only by filtration. 
C. By both diffusion and filtration. 
 
57. Blood circulation in the coronary arteries is greatest in/during which phase of the 
cardiac cycle? 
A. The beginning of the systole. 
B. The diastole. 
C. The end of the systole. 
 
58. The heart frequency is determined by the number of what? 
A. P tops. 
B. P and R tops. 
C. R tops. 
 
59. At what diastolic pressure is the boundary between hypertension and prehypertension 
usually set? 
A. 90 mm Hg. 
B. 100 mm Hg. 
C. 110 mm Hg. 
 
60. Where are the floating ribs located? 
A. Cranial/superior to the true rubs. 
B. Caudal/inferior to the true ribs. 
C. Between the true ribs. 
 
61. Each rib contains cartilage and bone? 
A. True. 
B. False. 
 
62. The diaphragm is innervated by the… 
A. N. phrenicus. 
B. N. vagus. 
C. Sympaticus. 
 
63. What happens to the diaphragm during inspiration?. 
A. It contracts. 
B. It relaxes. 
C. It rises. 
 
64. Where can you find goblet cells? 
A. In the alveolus. 
B. In the nasal cavity. 
C. In the trachea. 
 
65. In which form is most of the oxygen carried in the blood stream? 
A. As H2CO3. 
B. Bound to hemoglobin. 
C. Dissolved in the plasma. 
 
66. The total pressure of a mixture of non-reactive gases equals the partial pressures of the 
individual gases in that mixture. Which physical/chemical law states this? 
A. Boyle’s law. 
B. Dalton’s law. 
C. Henry’s law. 
 
67. Where is the respiratory regulation center located? 
A. In the brain cortex. 
B. In the brain stem. 
C. In the spinal cord. 
 
68. The stretch receptors in the tendons can influence respiration? 
A. True. 
B. False. 
 
69. The main cause of Chronic Obstructive Pulmonary Disease (COPD) is smoking. 
A. True. 
B. False. 
 
70. The figure below represents a pulmonary alveoli. Which number represents the 
respiratory membrane? 
A. 1. 
B. 2. 
C. 3. 
 
71. When do the AV valves close? 
A. At the beginning of the atrial systole. 
B. At the end of the ventricular systole. 
C. Shortly after depolarization of the ventricles. 
 
72. The sympathetic nervous system _______ the heart frequency. 
A. Does not influence. 
B. Increases. 
C. Decreases. 
 
73. Which is NOT one of the physical symptoms of stress? 
A. Heart palpitations. 
B. Back pain. 
C. Lower blood pressure. 
 
74. During exertion the respiratory volume is ________ at rest. 
A. The same as. 
B. Larger than. 
C. Smaller than. 
 
75. One of the effects of endurance training is that muscle fibers accumulate less 
glycogen. 
A. True. 
B. False. 
 
76. Arteriosclerosis is the thickening and stiffening of the walls of which blood vessels? 
A. Arteries. 
B. Arteries and veins. 
C. Arteries, veins and capillaries. 
 
77. What happens to blood pressure during exercise? 
A. It drops. 
B. It remains the same. 
C. It rises. 
 
78. All pulmonary alveoli are encompassed by capillaries.  
A. True. 
B. False. 
 
79. Which cardiac structure is represented by the number 3 on the figure below? 
A. Aortic valve. 
B. Mitral valve. 
C. Tricuspid valve. 
 
80. What is the left ventricular ejection fraction (LVEF)? 
A. The amount of blood that is ejected by the left ventricle with each systole. 
B. The amount of blood that is ejected from the left ventricle per minute. 
C. The percentage of the end-diastolic volume (EDV) that is ejected from the left 
ventricle with each systole 
`;

const exam1Answers = `
1. A 
2. A 
3. D 
4. C 
5. A 
6. D 
7. C 
8. B 
9. B 
10. B 
11. B 
12. D 
13. C 
14. B 
15. B 
16. A 
17. C 
18. A 
19. C 
20. B 
21. B 
22. D 
23. C 
24. B 
25. D 
26. D 
27. A 
28. A 
29. C 
30. B 
31. B 
32. C 
33. B 
34. D 
35. D 
36. C 
37. A 
38. B 
39. B 
40. B 
41. A 
42. A 
43. A 
44. B 
45. C 
46. B 
47. B 
48. B 
49. C 
50. B 
51. C 
52. C 
53. C 
54. B 
55. C 
56. C 
57. B 
58. C 
59. A 
60. B 
61. A 
62. A 
63. A 
64. C 
65. B 
66. B 
67. B 
68. A 
69. A 
70. C 
71. C 
72. B 
73. C 
74. B 
75. B 
76. A 
77. C 
78. A 
79. B 
80. C 
`;

// ---- Exam 2 (questions + answers) ----
const exam2Text = `
For each question choose the best answer from the options provided. 1p is awarded for each 
correct answer. 
 
1. Which of the following is an example of a negative feedback loop in human 
physiology? 
A. Blood clotting. 
B. Cellular respiration. 
C. The role of oxytocin during child birth. 
D. Sweating on a warm day. 
 
2. If a blood test comes back with a result indicating high triglyceride levels, that 
indicates the person is ingesting too much of which type of organic molecules in its 
diet? 
A. Carbohydrates. 
B. Lipids. 
C. Nucleic acids. 
D. Proteins. 
 
3. One of the important physiological functions of the blood is the regulation of body 
temperature. Under cold weather conditions, which of the following is TRUE? 
A. Constriction of the blood vessels near the skin. 
B. Hemoglobin levels decrease. 
C. Hemoglobin levels increase. 
D. Dilation of the blood vessels near the skin. 
 
4. For the target cells to respond to an hormone they must have specific protein 
receptors. Where are these receptors located? 
A. Both in the cell membrane and in the cytoplasm. 
B. Only in the cell membrane. 
C. Only in the cytoplasm.  
D. Only in the cell nucleus. 
 
5. One of the hormones produced by the pituitary gland is the Antidiuretic Hormone 
(ADH). What is the main physiological function of this hormone? 
A. It causes the adrenal glands to release corticosteroids. 
B. It causes the kidneys to reabsorb more water. 
C. It increases calcium levels in the blood. 
D. It regulates the production of female sex hormones in the ovaries. 
 
6. Where in the body can you find Kuppfer cells, immune system cells that destroy 
antigens entering the body through the digestive system? 
A. Large intestine. 
B. Liver. 
C. Stomach. 
D. Tonsils. 
 
7. In which part of the nephron is most water reabsorbed? 
A. In the proximal convoluted tubule. 
B. In the glomerulus. 
C. In the nephron loop. 
D. In the collecting duct. 
 
8. Mister Smith has O+ blood. Which of the following blood transfusion can be safely 
done with no risks for the people involved? 
A. Mister Smith donates blood to Miss Jones who has O- blood. 
B. Mister Smith donates blood to Mister Jackson who has A+ blood.  
C. Mister Smith receives blood from Mister Jackson who has A+ blood. 
D. None of the above. 
 
9. Which of the following sentences about the plasma membrane is NOT true? 
A. Oxygen can diffuse across the membrane. 
B. Phospholipids form the basic structure of the plasma membrane. 
C. Transport proteins are required to allow some chemicals across the membrane. 
D. Muscle cells have no plasma membrane to allow for a faster intake of glucose. 
 
10. Which of these physiological functions in NOT associated with the urinary system? 
A. Producing urine. 
B. Regulating blood pressure. 
C. Removing nitrogenous wastes from the body. 
D. Removing ethanol from the body. 
 
11. The Dutch cycling team went to train in the Alps before the start of the Olympic 
games. Which of the following changes would you expect to see in those athletes? 
A. A higher cardiac output. 
B. A higher concentration of hemoglobin in the blood. 
C. A lower pH level in the blood. 
D. A lower respiratory rate. 
 
12. Look at the picture below showing the internal structure of a kidney. Which structures 
do numbers 1, 2, 3 and 4 correspond to? 
A. 1 – renal capsule; 2 – renal pelvis; 3 – renal pyramid; 4 - nephron. 
B. 1 – renal cortex; 2 – glomerulus; 3 – renal pelvis; 4 – renal pyramid. 
C. 1 – renal cortex; 2 – renal capsule; 3 – renal pyramid; 4 – renal pelvis. 
D. 1 – renal medulla; 2 – renal cortex; 3 – nephron; 4 - ureter 
 
13. What would happen to the process of urine formation if the renal medulla became 
hyposmolar (low salt concentration)? 
A. The blood pressure would increase. 
B. The ion concentration in the blood would become lower. 
C. The person would need to micturate more frequently. 
D. The urine would turn brown. 
 
14. What is the cytosol? 
A. A cellular organelle responsible for packaging proteins for extracellular 
transport. 
B. A lipid responsible for transducing hormonal signals inside living cells. 
C. The fluid component of the cell, within which various organelles and particles 
are suspended. 
D. The material or protoplasm found within living cells, between the membrane 
and the nucleus. 
 
15. Which of the following substances in NOT commonly found in blood plasma? 
A. Carbon dioxide. 
B. Collagen. 
C. Glucose. 
D. Urea. 
 
16. Which two endocrine organs are involved in regulating calcium metabolism? 
A. Adrenal glands and thyroid. 
B. Pancreas and Pituitary. 
C. Parathyroid and Pancreas. 
D. Thyroid and parathyroid. 
 
17. Which of these symptoms is common in patients suffering from Diabetes Mellitus? 
A. Hypophagia (lack of appetite). 
B. Hypoglicemia (low blood sugar) 
C. Polyuria (excessive urination). 
D. Proteinuria (proteins in the urine). 
 
18. The figure below shows the results of an experiment where human red blood cells 
were exposed to three saline solutions with different concentrations. Given the 
behavior of the cells (upper panel) and the movement of water across their membranes 
(lower panel), which of these statements is TRUE? 
A. All three solutions have a similar concentration. 
B. Solution A has the highest salt concentration. 
C. Solution B has the highest salt concentration. 
D. Solution C has the highest salt concentration. 
 
19. Which of the following processes causes a DECREASE in blood pressure? 
A. Reduced water reabsorption in the nephrons. 
B. Release of renin in the kidney. 
C. Release of aldosterone in the adrenal glands. 
D. Vasoconstriction (narrowing of the blood vessels). 
 
20. Willem was biking along is normal route to school when a speeding car came in his 
direction. He barely managed to avoid the collision and was still shaking from the 
scare when he entered the classroom. If you could test his blood before and after the 
incident, which of these hormones would have had a significant increase? 
A. Adrenaline. 
B. Calcitonin. 
C. Melatonin. 
D. Parathyroid hormone (PTH). 
 
21. Which of the following sentences about steroid-based hormones is TRUE? 
A. They are only found in the hypothalamus. 
B. They are resistant to very low pH levels. 
C. They can to cross cell membranes. 
D. They regulate glucose levels in the blood. 
 
22. Which of these blood components carries cholesterol to the liver? 
A. Erythrocytes. 
B. High-density lipoproteins (HDL). 
C. Low-density lipoproteins (LDL). 
D. Platelets. 
 
23. The glomerular filtrate is the result of blood filtration in the kidneys, but not yet urine. 
Which of the following differences between glomerular filtrate and urine is FALSE? 
A. In healthy individuals, only the glomerular filtrate contains glucose. 
B. The body produces roughly 100x more glomerular filtrate than urine. 
C. Urine has a lower pH than the glomerular filtrate. 
D. Urine has more salt  than the glomerular filtrate. 
 
24. One of the items of safety equipment of a spacecraft removes carbon dioxide from the 
inside to keep the environment healthy for the astronauts. After an accident happened, 
the equipment stopped working, what do you expect would happen to the pH level of 
the astronaut’s blood? 
A. The pH would decrease (acidosis). 
B. The pH would increase (alkalosis). 
C. The pH would remain the same (homeostasis). 
 
25. Which of this conditions are characterized by the production of abnormal white blood 
cells? 
A. Anemia. 
B. Hemophilia. 
C. Leukemia. 
D. Puerperia. 
 
26. What is the ureter? 
A. A circular muscle that regulates the flow of urine into the outside of the body. 
B. An expandable muscular sac that accumulates urine produced in the kidney. 
C. A tube that carries urine from the kidneys to the urinary bladder. 
D. A tube that carries urine from the urinary bladder to the outside of the body. 
 
27. What is gluconeogenesis? 
A. The breakdown of glycogen into glucose. 
B. The formation of glycogen from glucose. 
C. The production of glucose from fats and/or aminoacids. 
D. The synthesis of aminoacids in the liver. 
 
28. Our body can only synthesize 11 of the 20 standard aminoacids. If the diet is lacking 
some of the other nine aminoacids this means we might be unable to synthesize which 
of these organic compounds? 
A. Carbohydrates. 
B. Lipids. 
C. Nucleic acids. 
D. Proteins. 
 
29. The figure below shows the results of a test to determine the blood type of a patient. 
Given the pattern of coagulation of the blood, what is the blood type of this patient? 
A. The blood type is A+. 
B. The blood type is AB+. 
C. The blood type is B-. 
D. The blood type is O-. 
 
30. Which of these is an example of an hormonal stimuli regulating hormone release? 
A. High levels of thyroid stimulating hormone (TSH) cause the release of T3 in 
the thyroid. 
B. Low concentrations of calcium in the blood cause the release of parathyroid 
hormone (PTH) in the parathyroid glands. 
C. The reception of light in the eyes regulates the release of melatonin in the 
pineal gland. 
D. The thoracic splanchnic nerves stimulate the release of noradrenaline in the 
adrenal glands. 
 
31. Why is it impossible for humans to survive at very high altitudes? 
A. Air temperatures above 5000 m are too cold to sustain life. 
B. Red blood cells burst due to low pressure and become unable to transport 
oxygen. 
C. The atmosphere at high altitudes has a different mixture of gases, with a 
smaller percentage of oxygen, leading to suffocation. 
D. The body reacts to low oxygen availability by increasing the amount of red 
blood cells, causing the blood to become too thick. 
 
32. The thyroid gland produces two hormones Triiodothyronine (T3) and Thyroxine (T4) 
together know as thyroid hormones. Which of the following is NOT a physiological 
response to the release of these hormones? 
A. Body temperature increases. 
B. Mitochondria increase the rate of cellular respiration. 
C. More glucose is consumed by the cells. 
D. The pituitary gland increases the release of thyroid-stimulating hormone 
(TSH). 
 
33. Which of these is the LOWEST level of organization in our body? 
A. Cells. 
B. Organelles. 
C. Organs. 
D. Systems. 
 
34. The hormone hCG (human chorionic gonadotropin) is very important in the initial 
stages of pregnancy has it avoids menstruations, thus allowing the embryo to safely 
attach to the uterine wall. Where is it produced? 
A. In the embryonic tissues (placenta). 
B. In the ovaries. 
C. In the pituitary gland. 
D. In the uterus. 
 
35. How do you call the process of filtrating the blood outside the body in patients 
suffering from renal failure? 
A. Hematopoiesis. 
B. Hematocrit. 
C. Hemodialysis 
D. Hemoglobin. 
 
36. Which of the following sentences regarding kidney vascularization is CORRECT? 
A. The afferent arteriole carries blood into the glomerulus. 
B. The efferent arteriole branches into several interlobal arteries. 
C. The renal vein carries blood into the kidney. 
D. The segmental arteries are located in the renal cortex. 
 
37. Which of following cases is an example of pinocytosis? 
A. Detection of insulin by protein receptors in the membrane of muscle cells. 
B. Diffusion of oxygen across the plasma membrane of red blood cells in the 
pulmonary alveoli. 
C. Ingestion of bacteria by neutrophil white blood cells during an infectious 
process. 
D. The uptake of extracellular fluids containing nutrients by cells of the intestinal 
wall. 
 
38. Which of the following sentences regarding kidney anatomy is TRUE? 
A. The nephrons are fully contained in the renal medula. 
B. The outer lining of the kidney is known as renal cortex. 
C. The renal pelvis collects the urine draining from the collecting ducts. 
D. The thinner part of the kidney, where blood vessel go in and out, in called the 
renal pyramid. 
 
39. As part of the monitoring of impacts caused by gas-drilling induced earthquakes in the 
province of Groningen, you were asked to measure the effect of these earthquakes on 
the long-term stress response of people living in the affected areas. Which of these 
hormones would you measure in those people? 
A. Aldosterone. 
B. Cortisone. 
C. Glucagon. 
D. Thyroxine (T4). 
 
40. Which of the following is NOT a physiological function of the blood? 
A. Coordination of body system responses. 
B. Protection against infectious agents. 
C. Regulation of body temperature. 
D. Transport of nutrients and gases. 
 
41. The sarcomeres are the functional units of the muscle. 
A. True. 
B. False. 
 
42. Myosin heads need calcium ions to make a cross-bridge. 
A. True. 
B. False. 
 
43. No ATP is required for an isometric muscle contraction. 
A. True. 
B. False. 
 
44. Myoglobin ensures the supply of what in the muscles? 
A. Blood. 
B. Glycogen. 
C. Oxygen. 
 
45. How is lactate formed in the muscles?  
A. By the aerobic metabolism. 
B. By glycolysis. 
C. By the splitting of creatine phosphate. 
 
46. Aerobic metabolism CANNOT be combined with anaerobic metabolism in a muscle 
cell. 
A. True. 
B. False. 
 
47. To run a marathon you benefit mostly from which of the following? 
A. Creatine phosphate. 
B. Glycolysis. 
C. Krebs cycle/oxidative phosphorylation. 
 
48. If a muscle’s length remains the same, what type of contraction did it make? 
A. Concentric. 
B. Eccentric. 
C. Isometric. 
 
49. How do you call muscles that have the opposite working mechanism? 
A. Agonists. 
B. Antagonists. 
C. Synergists. 
 
50. Anaerobic endurance is the capacity of muscles to perform for a short period under 
which conditions? 
A. Using only oxygen stored in the muscle cell. 
B. With insufficiently supplied oxygen. 
C. With sufficiently supplied oxygen. 
 
51. The VO2max is the maximal oxygen consumption during incremental exercise. In 
which unit is it expressed? 
A. ml. 
B. ml/min. 
C. ml/min per kg of body weight. 
 
52. Which of the following is TRUE below the anaerobic threshold? 
A. The muscle contains insufficient O2 for energy supply. 
B. A lot of pyruvic acid is converted into lactate. 
C. You can be in a steady state. 
 
53. The figure below represents a synovial joint. What structure is represented by the 
number 4? 
A. The capsule. 
B. The cartilage. 
C. The synovial membrane. 
 
54. Which part of a joint is responsible for lubrication, nutrition and strength distribution? 
A. The cartilage. 
B. The periost. 
C. The synovia. 
 
55. What forms the inner lining of the joint capsule? 
A. The cartilage. 
B. The ligaments. 
C. The synovial membrane. 
 
56. What is the function of the ligaments in a joint? 
A. Fixation of the hyaline cartilage. 
B. Movement of the joint. 
C. Reinforcement of the joint capsule. 
 
57. The figure below represents a joint. This type of joint is an articulatio… 
A. Ellipsoidea. 
B. Ginglymus. 
C. Sellaris. 
 
58. What type of joint is the elbow joint? 
A. Ball-and-socket. 
B. Complex. 
C. Pivot. 
 
59. Which of these processes results in the acidification of the muscle? 
A. ATP spliting. 
B. ATP synthesis. 
C. Lactate production. 
 
60. Which of the following should be consumed to prevent fatigue during activity? 
A. Fats. 
B. Foods with a high glycemic index. 
C. Proteins. 
 
61. How do you call a joint based on a link with connective tissue between two bones? 
A. Synchondrosis. 
B. Syndesmosis. 
C. Synostosis. 
 
62. Which of the following is a capacity vessel? 
A. A capillary. 
B. A vein. 
C. An artery. 
 
63. In which type of blood vessel will you find valves? 
A. In arteries. 
B. In capillaries. 
C. In veins. 
 
64. How are substances transported over the capillary wall? 
A. Only by diffusion. 
B. Only by filtration. 
C. By both diffusion and filtration. 
 
65. Relatively speaking, arterioles have the largest amount of smooth muscle tissue among 
all blood vessels. 
A. True. 
B. False. 
 
66. Where is the smooth muscle tissue of the vascular walls located? 
A. In the tunica adventitia. 
B. In the tunica media. 
C. In the tunica intima. 
 
67. Which muscle fibers are wired by the most capillaries? 
A. Heart muscle fibres. 
B. Red muscle fibres. 
C. White muscle fibres. 
 
68. The figure below represents the heart and its main blood vessels. Which blood vessel 
is represented by the letter A? 
A. Aorta. 
B. A. pulmonaris. 
C. V. pulmonaris. 
 
69. According to the Frank-Starling effect, what happens to the beat volume when the 
filling of the ventricles increases? 
A. It decreases. 
B. It increases. 
C. It remains the same. 
 
70. The cardiac output is the volume of blood ejected by the heart per minute. It equals 
which of the following options? 
A. Beat volume at rest. 
B. Beat volume of the left ventricle. 
C. Beat volume times the heart frequency. 
 
71. Electric stimuli pass the bundle of His on their way to where? 
A. To the AV node. 
B. To the Purkinje fibres. 
C. To the SA node. 
 
72. What effect does the sympathetic nervous system have on the heart frequency? 
A. It has no influence on heart frequency. 
B. It increases the heart frequency. 
C. It lowers the heart frequency. 
 
73. What is the consequence of exertion on the QRS complex? 
A. The complex becomes higher. 
B. The complex becomes wider. 
C. The number of complexes increases. 
 
74. What happens to blood pressure during exercise? 
A. It drops. 
B. It remains the same. 
C. It rises. 
 
75. Which of the following is the most important respiratory muscle? 
A. The diaphragm. 
B. The m. intercostalis externus. 
C. The m rectus abdominis. 
 
76. Which of the following is TRUE regarding relaxed respiration? 
A. It is a passive event.  
B. It requires contraction of the diaphragm. 
C. It requires contraction of the mm. intercostales. 
 
77. The wall of a pulmonary alveolus has a thickness of a single cell layer. 
A. True. 
B. False. 
 
78. All pulmonary alveoli are encompassed by capillaries.  
A. True. 
B. False. 
 
79. Where is the respiratory regulation center located? 
A. In the brain cortex. 
B. In the brain stem. 
C. In the spinal cord. 
 
80. The figure below represents part of the respiratory system. Which number corresponds 
to the bifurcation? 
A. 3. 
B. 4. 
C. 6. 
D. 7. 
`;

const exam2Answers = `
1 – D 
2 – B 
3 – A 
4 – A 
5 – B 
6 – B 
7 – C 
8 – B 
9 – D 
10 – D 
11 – B 
12 – C 
13 – C 
14 – C 
15 – D 
16 – D 
17 – C 
18 – B 
19 – A 
20 – A 
21 – C 
22 – B 
23 – D 
24 – A 
25 – C 
26 – C 
27 – C 
28 – D 
29 – A 
30 – A 
31 – D 
32 – D 
33 – B 
34 – A 
35 – C 
36 – A 
37 – D 
38 – C 
39 – B 
40 – A 
41 – A 
42 – A 
43 – B 
44 – C 
45 – B 
46 – B 
47 – C 
48 – C 
49 – B 
50 – B 
51 – C 
52 – C 
53 – B 
54 – C 
55 – C 
56 – C 
57 – B 
58 – B 
59 – A 
60 – B 
61 – B 
62 – B 
63 – C 
64 – C 
65 – A 
66 – B 
67 – A 
68 – A 
69 – B 
70 – C 
71 – B 
72 – B 
73 – C 
74 – C 
75 – A 
76 – A 
77 – A 
78 – A 
79 – B 
80 – B 
`;

// ---------------- Parsing helpers ----------------
const idxFromLetter = (s) => ({ A: 0, B: 1, C: 2, D: 3 }[s.toUpperCase()]);

function parseQuestionsAndAnswers(qText, aText, subject) {
  const lines = qText.replace(/\r/g, '').split('\n');
  const qRe = /^(\d{1,3})[\.|\)]\s+(.*)$/;
  const optRe = /^(A|B|C|D)[\.|\)]?\s+(.*)$/i;
  const items = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(qRe);
    if (!m) continue;
    const id = Number(m[1]);
    const question = m[2].trim();
    const options = [];
    for (let j = i + 1; j < lines.length && options.length < 4; j++) {
      const s = lines[j].trim();
      if (!s) break;
      const o = s.match(optRe);
      if (o) options.push(o[2].trim()); else break;
    }
    if (options.length >= 2) items.push({ id, subject, question, options, correct: 0, explanation: '' });
  }
  const aMap = new Map();
  aText.replace(/\r/g, '').split('\n').forEach((l) => {
    const m = l.trim().match(/^(\d{1,3})\s*[\.-–—:]\s*([ABCD])\b/i);
    if (m) aMap.set(Number(m[1]), idxFromLetter(m[2]));
  });
  return items.map((q) => (aMap.has(q.id) ? { ...q, correct: aMap.get(q.id) } : q));
}

const EXAM1_BANK = parseQuestionsAndAnswers(exam1Text, exam1Answers, 'Exam 1');
const EXAM2_BANK = parseQuestionsAndAnswers(exam2Text, exam2Answers, 'Exam 2');

// ---------------- Component ----------------
export default function QuizPracticeWebsite() {
  const [dataset, setDataset] = useState('Exam 1'); // 'Exam 1' | 'Exam 2' | 'Both'

  const bank = useMemo(() => {
    if (dataset === 'Exam 1') return EXAM1_BANK;
    if (dataset === 'Exam 2') return EXAM2_BANK;
    return [...EXAM1_BANK, ...EXAM2_BANK].map((q, i) => ({ ...q, id: i + 1 }));
  }, [dataset]);

  // State
  const [questions, setQuestions] = useState(bank);
  const [activeQuestions, setActiveQuestions] = useState(bank);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [incorrectIds, setIncorrectIds] = useState(new Set());
  const [attemptCount, setAttemptCount] = useState(1);
  const [answersTotal, setAnswersTotal] = useState(0);
  const [answersCorrect, setAnswersCorrect] = useState(0);
  const [answeredCorrectOnce, setAnsweredCorrectOnce] = useState(new Set());
  const [quizComplete, setQuizComplete] = useState(false);
  const [isRetryMode, setIsRetryMode] = useState(false);

  useEffect(() => {
    // Validate bank
    const errs = [];
    bank.forEach((q, i) => {
      if (!Array.isArray(q.options) || q.options.length < 2) errs.push(`q${q.id} has <2 options`);
      if (!(q.correct >= 0 && q.correct < q.options.length)) errs.push(`q${q.id} invalid correct index`);
    });
    if (errs.length) console.error('[Dataset validation]', errs);
  }, [bank]);

  useEffect(() => {
    setQuestions(bank);
    setActiveQuestions(bank);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIncorrectIds(new Set());
    setAttemptCount(1);
    setAnswersTotal(0);
    setAnswersCorrect(0);
    setAnsweredCorrectOnce(new Set());
    setQuizComplete(false);
    setIsRetryMode(false);
  }, [bank]);

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const progress = Math.round((answeredCorrectOnce.size / (questions.length || 1)) * 100);
  const accuracy = answersTotal > 0 ? ((answersCorrect / answersTotal) * 100).toFixed(1) : '0.0';

  function handleAnswerSelect(index) {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    setAnswersTotal((v) => v + 1);
    const isCorrect = index === currentQuestion.correct;
    if (isCorrect) {
      setAnswersCorrect((v) => v + 1);
      setIncorrectIds((prev) => { const ns = new Set(prev); ns.delete(currentQuestion.id); return ns; });
      setAnsweredCorrectOnce((prev) => { const ns = new Set(prev); ns.add(currentQuestion.id); return ns; });
    } else {
      setIncorrectIds((prev) => { const ns = new Set(prev); ns.add(currentQuestion.id); return ns; });
    }
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      return;
    }
    if (incorrectIds.size > 0 && !quizComplete) {
      const retryQ = questions.filter((q) => incorrectIds.has(q.id));
      setActiveQuestions(retryQ);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsRetryMode(true);
      setAttemptCount((v) => v + 1);
    } else {
      setQuizComplete(true);
    }
  }

  function restartQuiz() {
    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIncorrectIds(new Set());
    setAttemptCount(1);
    setAnswersTotal(0);
    setAnswersCorrect(0);
    setAnsweredCorrectOnce(new Set());
    setQuizComplete(false);
    setIsRetryMode(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quiz Practice</h1>
            <div className="flex items-center gap-2">
              <select value={dataset} onChange={(e)=>setDataset(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <option>Exam 1</option>
                <option>Exam 2</option>
                <option>Both</option>
              </select>
              <button onClick={restartQuiz} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <RotateCcw className="w-4 h-4" /> Restart
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <MiniStat icon={<Target className="w-4 h-4 text-blue-500"/>} top={`${currentQuestionIndex+1}/${activeQuestions.length}`} bottom={isRetryMode?'Retry Mode':'Question'} />
            <MiniStat icon={<TrendingUp className="w-4 h-4 text-green-500"/>} top={`${progress}%`} bottom="Progress" />
            <MiniStat icon={<Award className="w-4 h-4 text-purple-500"/>} top={`${accuracy}%`} bottom="Accuracy" />
            <MiniStat icon={<RotateCcw className="w-4 h-4 text-orange-500"/>} top={attemptCount} bottom="Attempts" />
          </div>
          <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden" aria-label={`Progress ${progress}%`}>
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isRetryMode && (
          <div className="mb-6 p-4 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-lg text-orange-900 dark:text-orange-200">
            Retry Mode: Answer the {activeQuestions.length} question{activeQuestions.length>1?'s':''} you got wrong
          </div>
        )}

        {currentQuestion && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">{currentQuestion.subject}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Question {currentQuestionIndex+1} of {activeQuestions.length}</span>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correct;
                const isSelected = index === selectedAnswer;
                const showCorrect = showFeedback && isCorrect;
                const showIncorrect = showFeedback && isSelected && !isCorrect;
                return (
                  <button key={index} onClick={()=>handleAnswerSelect(index)} disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform ${!showFeedback ? 'hover:scale-[1.02] hover:shadow-md cursor-pointer' : ''} ${showCorrect ? 'bg-green-50 dark:bg-green-900/30 border-green-500 animate-pulse' : ''} ${showIncorrect ? 'bg-red-50 dark:bg-red-900/30 border-red-500 animate-shake' : ''} ${!showFeedback && !isSelected ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500' : ''} ${isSelected && !showFeedback ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500' : ''}`}
                    aria-pressed={isSelected} aria-label={`Option ${String.fromCharCode(65+index)}: ${option}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 dark:text-white font-medium">{String.fromCharCode(65+index)}. {option}</span>
                      {showCorrect && <Check className="w-6 h-6 text-green-600 dark:text-green-400 animate-scaleIn" />}
                      {showIncorrect && <X className="w-6 h-6 text-red-600 dark:text-red-400 animate-scaleIn" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div className={`mt-6 p-4 rounded-xl animate-slideDown ${selectedAnswer===currentQuestion.correct?'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700':'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-1 rounded-full ${selectedAnswer===currentQuestion.correct?'bg-green-100 dark:bg-green-800':'bg-blue-100 dark:bg-blue-800'}`}>
                    {selectedAnswer===currentQuestion.correct ? <Check className="w-4 h-4 text-green-600 dark:text-green-400"/> : <X className="w-4 h-4 text-blue-600 dark:text-blue-400"/>}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold mb-1 ${selectedAnswer===currentQuestion.correct?'text-green-700 dark:text-green-300':'text-blue-700 dark:text-blue-300'}`}>{selectedAnswer===currentQuestion.correct?'Correct!':'Explanation:'}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{currentQuestion.explanation || '—'}</p>
                  </div>
                </div>
              </div>
            )}

            {showFeedback && (
              <div className="mt-6 flex justify-end">
                <button onClick={handleNextQuestion} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all animate-fadeIn">
                  {currentQuestionIndex===activeQuestions.length-1 ? (incorrectIds.size>0 ? 'Review Incorrect Questions' : 'Complete Quiz') : 'Next Question'}
                  <ChevronRight className="w-5 h-5"/>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <StyleBlock />
    </div>
  );
}

function MiniStat({ icon, top, bottom }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="text-sm">
        <div className="font-semibold text-gray-800 dark:text-white">{top}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{bottom}</div>
      </div>
    </div>
  );
}

function StyleBlock() {
  return (
    <style>{`
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
      @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); } 20%, 40%, 60%, 80% { transform: translateX(2px); } }
      .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      .animate-slideDown { animation: slideDown 0.3s ease-out; }
      .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      .animate-shake { animation: shake 0.5s ease-out; }
    `}</style>
  );
}
