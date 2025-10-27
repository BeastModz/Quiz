import json

# Exam 1 questions text
questions_text = """Which of these physiological phenomena is an example of a POSITIVE feedback loop??
A. Blood clotting.
B. Glycolysis in the liver.
C. Hypothalamic regulation of urine production.
D. Thyroidal regulation of metabolic rate.

Which of the following is NOT an important role of water in the human body?
A. Dissolution of lipids in cell membranes.
B. Hydrolysis of organic polymers.
C. Regulation of body temperature.
D. Transport of nutrients around the body.

Which of these physiological functions in NOT associated with the urinary system?
A. Producing urine.
B. Regulating blood pressure.
C. Removing nitrogenous wastes from the body.
D. Removing ethanol from the body.

In which part of the nephron does blood filtration take place?
A. In the convoluted tube.
B. In the efferent arteriole.
C. In the glomerulus. 
D. In the nephron loop.

Some blood leukocytes are capable of phagocytosis.
A. True.
B. False.

Which of these chemicals is NOT relevant for regulating blood pH levels?
A. Carbonate ion (CO2-3).
B. Carbon dioxide (CO2).
C. Hydrogen ion (H+).
D. Oxygen (O2).

Which of these hormones is produced by the corpus luteum and prepares the endometrium for a possible pregnancy?
A. Estrogen.
B. Noradrenaline.
C. Progesterone.
D. Testosterone.

Which of these is an example of a humoral stimuli regulating hormone release?
A. High levels of thyroid stimulating hormone (TSH) cause the release of T3 in the thyroid.
B. Low concentrations of calcium in the blood cause the release of parathyroid hormone (PTH) in the parathyroid glands. 
C. Testosterone released in the testes inhibits the release of follicle-stimulating hormone (FSH) and luteinizing hormone (LH) in the anterior pituitary gland.
D. The thoracic splanchnic nerves stimulate the release of noradrenaline in the adrenal glands.

Which of the following is NOT a function of the liver?
A. Convert ammonium wastes into urea.
B. Hydrolyze cancerous cells to avoid tumors.
C. Metabolize ethanol into acetate that can be excreted in the urine.
D. Synthesize glucose from fats and aminoacids.

What is the LOWEST level of organization in our body?
A. Cells.
B. Organelles.
C. Organs.
D. Systems.

Fill in the blank with one of the following option: The _________ is responsible for disposing of unwanted molecules in the cell.
A. Golgi apparatus.
B. Lysosome.
C. Mitochondrion.
D. Ribosome.

In the movie Jurassic Park, the dinosaurs had a genetic mutation that made them unable to synthesize the aminoacid lysine. Assuming they didn't get lysine from their diet, this means they would be UNABLE to synthesize which type of macromolecule?
A. Carbohydrates.
B. Lipids.
C. Nucleic acids.
D. Proteins.

Which of the following sentences regarding urine formation is CORRECT?
A. Blood filtration is powered by enzymes.
B. During filtration, all proteins, sugars and ions are removed from the blood.
C. Ions are reabsorbed in the convoluted tubule through active transport.
D. Water is mostly reabsorbed in the distal part of the convoluted tubule.

Which two organs are involved in the regulation of glucose levels in the blood?
A. Adrenal glands and Thyroid.
B. Pancreas and Liver.
C. Parathyroid and Pancreas.
D. Thyroid and Parathyroid.

An animal exposed to cold weather conditions is likely to have which of the following?
A. High levels of insulin in the blood.
B. High levels of thyroid hormones in the blood.
C. Low levels of oxytocin in the blood.
D. Low levels of testosterone in the blood.

The figure below shows the results of an experiment where human red blood cells were exposed to three saline solutions with different concentrations. Given the behavior of the cells (upper panel) and the movement of water across their membranes (lower panel), which of these statements is FALSE?
A. Solution A has the lowest salt concentration.
B. Solution B has a salt concentration similar to that of human blood.
C. The green arrows represent water movement by osmosis.
D. The yellow arrows represent water movement by osmosis.

What is the cytosol?
A. A cellular organelle responsible for packaging proteins for extracellular transport.
B. A lipid responsible for transducing hormonal signals inside living cells.
C. The fluid component of the cell, within which various organelles and particles are suspended.
D. The material or protoplasm found within living cells, between the membrane and the nucleus.

Where does hematopoiesis takes place?
A. In the bone marrow.
B. In the kidneys.
C. In the liver.
D. In the pancreas.

Look at the picture below showing the main organs of the endocrine system. Which organs do numbers 1, 2, 3 and 4 correspond to?
A. 1 – Pancreas; 2 – Adrenal gland; 3 – Liver; 4 – Kidney.
B. 1 – Parathyroid gland; 2 – Thyroid gland; 3 – Liver; 4 - Testes.
C. 1 – Thyroid gland; 2 – Adrenal gland; 3 – Pancreas; 4 - Testes.
D. 1 – Thyroid gland; 2 – Parathyroid gland; 3 – Pancreas; 4 - Testes.

Which of the following hormones is produced in the islets of Langerhans?
A. Aldosterone.
B. Insulin.
C. Renin.
D. Thyroxine (T4).

As part of the monitoring of impacts caused by gas-drilling induced earthquakes in the province of Groningen, you were asked to measure the effect of these earthquakes on the long-term stress response of people living in the affected areas. Which of these hormones would you measure in those people?
A. Aldosterone.
B. Cortisone.
C. Glucagon.
D. Thyroxine (T4).

What is the urethra?
A. A circular muscle that regulates the flow of urine into the outside of the body.
B. An expandable sac that accumulates urine produced in the kidneys.
C. A tube that carries urine from the kidneys to the urinary bladder.
D. A tube that carries urine from the urinary bladder to the outside of the body.

What is the main characteristic of passive membrane transport across the cell membrane?
A. Protein channels are always necessary.
B. It requires ATP to be consumed.
C. Solutes move from higher to lower concentration.
D. Solutes move from lower to higher concentration.

Which of these blood components carries cholesterol to the liver?
A. Erythrocytes.
B. High-density lipoproteins (HDL).
C. Leukocytes.
D. Platelets.

The glomerular filtrate is the result of blood filtration in the kidneys, but not yet urine. Which of the following differences between glomerular filtrate and urine is FALSE?
A. In healthy individuals, only the glomerular filtrate contains glucose.
B. The body produced roughly 100x more glomerular filtrate than urine.
C. Urine has a lower pH than the glomerular filtrate.
D. Urine has more salt than the glomerular filtrate.

Which of the following is an example of pinocytosis?
A. Detection of insulin by protein receptors in the membrane of muscle cells.
B. Diffusion of oxygen across the plasma membrane of red blood cells in the pulmonary alveoli.
C. Ingestion of bacteria by neutrophil leukocytes during an infectious process.
D. The uptake of extracellular fluids containing nutrients by cells of the intestinal wall.

What will the liver do in the presence of glucagon?
A. Break down glycogen to release glucose.
B. Break down cholesterol to release fatty acids.
C. Break down complex fats for storage.
D. Synthesize aminoacids necessary for the production of new proteins.

Which of the following statements about sickle cell anemia is TRUE?
A. Patients with this disease show reduced oxygen transport in blood.
B. The erythrocytes of the patient become biconcave.
C. The disease is caused by the same mosquito that carries malaria.
D. This disease is most common is people with Asian descent.

Which of the following sentences regarding kidney anatomy is TRUE?
A. The nephrons are fully contained in the renal medula.
B. The outer lining of the kidney is known are renal cortex.
C. The renal pelvis collects the urine draining from the collecting ducts.
D. The thinner part of the kidney, where blood vessels go in and out, is called the renal pyramid.

In which situation will the kidney produce the hormone renin?
A. When bacteria are present in the urine.
B. When blood pressure in the afferent arteriole is low.
C. When blood pressure in the efferent arteriole is high.
D. When glucose is present in the urine.

What happens after a person is inoculated with a smallpox vaccine?
A. The immune system starts producing leukocytes capable of fighting smallpox.
B. The immune system starts producing smallpox specific antibodies.
C. The immune system starts producing unspecific antibodies.
D. Nothing. Vaccines are a conspiracy designed by big pharmaceutical companies for immediate profit.

Which of these condition is characterized by the production of abnormal white blood cells?
A. Anemia.
B. Hemophilia.
C. Leukemia.
D. Leukocytis.

Some aminoacids can only be obtained from food, while others can be synthesized in the human body. Which organ is responsible for aminoacid synthesis in humans?
A. Kidney.
B. Liver.
C. Pancreas.
D. Thyroid gland.

Which of these sentences regarding hormone action is TRUE?
A. Hormones are produced in specific tissues called target tissues.
B. Hormones are detected by specific phospholipidic receptors in plasma membranes.
C. Hormones have no significant effect of DNA and gene expression.
D. Non-steroid hormones require a second messenger to carry their signal inside the cells.

Which of these physiological processes involves the oxidation of iron atoms?
A. Blood clotting.
B. Phagocytosis.
C. Transport of glucose across the plasma membrane.
D. Transport of oxygen in the blood.

Which of the following sentences about the plasma membrane is TRUE?
A. All transport proteins require ATP to carry substances across the membrane.
B. Glycolipids form the basic structure of the plasma membrane.
C. Oxygen can diffuse across the membrane.
D. Muscle cells have no plasma membrane to allow for a faster intake of glucose.

Which of the following processes causes a DECREASE in blood pressure?
A. Reduced water reabsorption in the nephrons.
B. Release of renin in the kidney.
C. Release of aldosterone in the adrenal glands.
D. Vasoconstriction (narrowing of the blood vessels).

Which of these components is NOT found in healthy urine?
A. Bicarbonate ion.
B. Hemoglobin.
C. Urea.
D. Water.

Which of the following substances is NOT commonly found in blood plasma?
A. Carbon dioxide.
B. Collagen.
C. Glucose.
D. Urea.

There are three chemical types of hormones. Which are they?
A. Aminoacid-based, Nucleotide-based and Steroids.
B. Aminoacid-based, Fatty acid derivatives and Steroids.
C. Nuceotide-based, Fatty acid derivatives and Steroids.
D. Steroids, Glicocorticoids and Fatty acid derivatives.

Sarcomeres are the functional units of the muscle.
A. True.
B. False

A fasciculus is made up of fibres.
A. True.
B. False.

In a contraction, the Z-lines (discs) can be further separated.
A. True.
B. False.

Fill in the blank. Fine motor activities require _____ motor units.
A. Large.
B. Small.

Fill in the blank. The Krebs cycle with oxidative phosphorylation produces ___ molecules of ATP per molecule of glucose.
A. 1.
B. 3.
C. 36

Lactate is formed by which metabolic process?
A. Aerobic metabolism.
B. Glycolysis.
C. Splitting of creatine phosphate.

Synergists are muscle that…
A. Cause the same movement.
B. Do not influence each other's working.
C. Work against each other.

Anaerobic endurance is the capacity of muscles to perform for a short period of time under which conditions?
A. Using oxygen stored in the cell.
B. With insufficiently supplied oxygen.
C. With sufficiently supplied oxygen.

Which of the following options is TRUE below the anaerobic threshold?
A. Large amounts of pyruvic acid are converted into lactate.
B. The muscle contains insufficient O2 for energy supply.
C. You can be in a steady state.

Interval trainings cause the number of mitochondria to diminish.
A. True.
B. False.

Lubrication, nutrition and strength distribution in a joint are a function of which structure?
A. Cartilage.
B. Periost.
C. Synovia.

The inner lining of the joint capsule is formed by which structure?
A. Cartilage.
B. Ligament.
C. Synovial membrane.

The figure below represents a joint. What type of articulation is it?
A. Ellipsoidea.
B. Ginglymus.
C. Sellaris.

A joint based on a link with connective tissue between two bones is called?
A. Synchondrosis.
B. Syndesmosis.
C. Synostosis.

Which of the following are capacity vessels?
A. Arteries.
B. Capillaries.
C. Veins.

How does transport over the capillary walls takes place?
A. Only by diffusion.
B. Only by filtration.
C. By both diffusion and filtration.

Blood circulation in the coronary arteries is greatest in/during which phase of the cardiac cycle?
A. The beginning of the systole.
B. The diastole.
C. The end of the systole.

The heart frequency is determined by the number of what?
A. P tops.
B. P and R tops.
C. R tops.

At what diastolic pressure is the boundary between hypertension and prehypertension usually set?
A. 90 mm Hg.
B. 100 mm Hg.
C. 110 mm Hg.

Where are the floating ribs located?
A. Cranial/superior to the true rubs.
B. Caudal/inferior to the true ribs.
C. Between the true ribs.

Each rib contains cartilage and bone?
A. True.
B. False.

The diaphragm is innervated by the…
A. N. phrenicus.
B. N. vagus.
C. Sympaticus.

What happens to the diaphragm during inspiration?.
A. It contracts.
B. It relaxes.
C. It rises.

Where can you find goblet cells?
A. In the alveolus.
B. In the nasal cavity.
C. In the trachea.

In which form is most of the oxygen carried in the blood stream?
A. As H2CO3.
B. Bound to hemoglobin.
C. Dissolved in the plasma.

The total pressure of a mixture of non-reactive gases equals the partial pressures of the individual gases in that mixture. Which physical/chemical law states this?
A. Boyle's law.
B. Dalton's law.
C. Henry's law.

Where is the respiratory regulation center located?
A. In the brain cortex.
B. In the brain stem.
C. In the spinal cord.

The stretch receptors in the tendons can influence respiration?
A. True.
B. False.

The main cause of Chronic Obstructive Pulmonary Disease (COPD) is smoking.
A. True.
B. False.

The figure below represents a pulmonary alveoli. Which number represents the respiratory membrane?
A. 1.
B. 2.
C. 3.

When do the AV valves close?
A. At the beginning of the atrial systole.
B. At the end of the ventricular systole.
C. Shortly after depolarization of the ventricles.

The sympathetic nervous system _______ the heart frequency.
A. Does not influence.
B. Increases.
C. Decreases.

Which is NOT one of the physical symptoms of stress?
A. Heart palpitations.
B. Back pain.
C. Lower blood pressure.

During exertion the respiratory volume is ________ at rest.
A. The same as.
B. Larger than.
C. Smaller than.

One of the effects of endurance training is that muscle fibers accumulate less glycogen.
A. True.
B. False.

Arteriosclerosis is the thickening and stiffening of the walls of which blood vessels?
A. Arteries.
B. Arteries and veins.
C. Arteries, veins and capillaries.

What happens to blood pressure during exercise?
A. It drops.
B. It remains the same.
C. It rises.

All pulmonary alveoli are encompassed by capillaries.
A. True.
B. False.

Which cardiac structure is represented by the number 3 on the figure below?
A. Aortic valve.
B. Mitral valve.
C. Tricuspid valve.

What is the left ventricular ejection fraction (LVEF)?
A. The amount of blood that is ejected by the left ventricle with each systole.
B. The amount of blood that is ejected from the left ventricle per minute.
C. The percentage of the end-diastolic volume (EDV) that is ejected from the left ventricle with each systole"""

# Answers
answers = ['A','A','D','C','A','D','C','B','B','B','B','D','C','B','B','A','C','A','C','B','B','D','C','B','D','D','A','A','C','B','B','C','B','D','D','C','A','B','B','B','A','A','A','B','C','B','B','B','C','B','C','C','C','B','C','C','B','C','A','B','A','A','A','A','C','B','B','B','A','A','C','C','B','C','B','B','A','C','A','C']

# Parse questions
questions = []
current_q = {"question": "", "options": []}
q_num = 0

for line in questions_text.strip().split('\n'):
    line = line.strip()
    if not line:
        if current_q["question"] and current_q["options"]:
            q_num += 1
            # Determine question type
            if len(current_q["options"]) == 2 and current_q["options"][0].startswith("True") and current_q["options"][1].startswith("False"):
                q_type = "true-false"
            elif len(current_q["options"]) <= 3 and all(opt in ['A', 'B', 'C'] for opt in [o.split('.')[0] for o in current_q["options"] if '.' in o]):
                q_type = "multiple-choice"
            else:
                q_type = "multiple-choice"
            
            questions.append({
                "id": q_num,
                "exam": "Exam 1",
                "type": q_type,
                "question": current_q["question"],
                "image": None if "figure below" not in current_q["question"].lower() and "picture below" not in current_q["question"].lower() else "Image required",
                "options": current_q["options"],
                "correct": answers[q_num-1] if q_num <= len(answers) else "A",
                "explanation": None,
                "originalNumber": q_num
            })
        current_q = {"question": "", "options": []}
    elif line and not line.startswith(('A.', 'B.', 'C.', 'D.')):
        if not current_q["question"]:
            current_q["question"] = line
        else:
            current_q["question"] += " " + line
    elif line.startswith(('A.', 'B.', 'C.', 'D.')):
        current_q["options"].append(line[3:].strip())

# Handle last question
if current_q["question"] and current_q["options"]:
    q_num += 1
    questions.append({
        "id": q_num,
        "exam": "Exam 1",
        "type": "true-false" if len(current_q["options"]) == 2 else "multiple-choice",
        "question": current_q["question"],
        "image": None if "figure below" not in current_q["question"].lower() and "picture below" not in current_q["question"].lower() else "Image required",
        "options": current_q["options"],
        "correct": answers[q_num-1] if q_num <= len(answers) else "A",
        "explanation": None,
        "originalNumber": q_num
    })

# Save to JSON
with open('exam1_parsed.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"✅ Parsed {len(questions)} questions from Exam 1")
print(f"📄 Saved to: exam1_parsed.json")
