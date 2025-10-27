import json

# Exam 2 questions text
questions_text = """Which of the following is an example of a negative feedback loop in human physiology?
A. Blood clotting.
B. Cellular respiration.
C. The role of oxytocin during child birth.
D. Sweating on a warm day.

If a blood test comes back with a result indicating high triglyceride levels, that indicates the person is ingesting too much of which type of organic molecules in its diet?
A. Carbohydrates.
B. Lipids.
C. Nucleic acids.
D. Proteins.

One of the important physiological functions of the blood is the regulation of body temperature. Under cold weather conditions, which of the following is TRUE?
A. Constriction of the blood vessels near the skin.
B. Hemoglobin levels decrease.
C. Hemoglobin levels increase.
D. Dilation of the blood vessels near the skin.

For the target cells to respond to an hormone they must have specific protein receptors. Where are these receptors located?
A. Both in the cell membrane and in the cytoplasm.
B. Only in the cell membrane.
C. Only in the cytoplasm.
D. Only in the cell nucleus.

One of the hormones produced by the pituitary gland is the Antidiuretic Hormone (ADH). What is the main physiological function of this hormone?
A. It causes the adrenal glands to release corticosteroids.
B. It causes the kidneys to reabsorb more water.
C. It increases calcium levels in the blood.
D. It regulates the production of female sex hormones in the ovaries.

Where in the body can you find Kuppfer cells, immune system cells that destroy antigens entering the body through the digestive system?
A. Large intestine.
B. Liver.
C. Stomach.
D. Tonsils.

In which part of the nephron is most water reabsorbed?
A. In the proximal convoluted tubule.
B. In the glomerulus.
C. In the nephron loop.
D. In the collecting duct.

Mister Smith has O+ blood. Which of the following blood transfusion can be safely done with no risks for the people involved?
A. Mister Smith donates blood to Miss Jones who has O- blood.
B. Mister Smith donates blood to Mister Jackson who has A+ blood.
C. Mister Smith receives blood from Mister Jackson who has A+ blood.
D. None of the above.

Which of the following sentences about the plasma membrane is NOT true?
A. Oxygen can diffuse across the membrane.
B. Phospholipids form the basic structure of the plasma membrane.
C. Transport proteins are required to allow some chemicals across the membrane.
D. Muscle cells have no plasma membrane to allow for a faster intake of glucose.

Which of these physiological functions in NOT associated with the urinary system?
A. Producing urine.
B. Regulating blood pressure.
C. Removing nitrogenous wastes from the body.
D. Removing ethanol from the body.

The Dutch cycling team went to train in the Alps before the start of the Olympic games. Which of the following changes would you expect to see in those athletes?
A. A higher cardiac output.
B. A higher concentration of hemoglobin in the blood.
C. A lower pH level in the blood.
D. A lower respiratory rate.

Look at the picture below showing the internal structure of a kidney. Which structures do numbers 1, 2, 3 and 4 correspond to?
A. 1 – renal capsule; 2 – renal pelvis; 3 – renal pyramid; 4 - nephron.
B. 1 – renal cortex; 2 – glomerulus; 3 – renal pelvis; 4 – renal pyramid.
C. 1 – renal cortex; 2 – renal capsule; 3 – renal pyramid; 4 – renal pelvis.
D. 1 – renal medulla; 2 – renal cortex; 3 – nephron; 4 - ureter

What would happen to the process of urine formation if the renal medulla became hyposmolar (low salt concentration)?
A. The blood pressure would increase.
B. The ion concentration in the blood would become lower.
C. The person would need to micturate more frequently.
D. The urine would turn brown.

What is the cytosol?
A. A cellular organelle responsible for packaging proteins for extracellular transport.
B. A lipid responsible for transducing hormonal signals inside living cells.
C. The fluid component of the cell, within which various organelles and particles are suspended.
D. The material or protoplasm found within living cells, between the membrane and the nucleus.

Which of the following substances in NOT commonly found in blood plasma?
A. Carbon dioxide.
B. Collagen.
C. Glucose.
D. Urea.

Which two endocrine organs are involved in regulating calcium metabolism?
A. Adrenal glands and thyroid.
B. Pancreas and Pituitary.
C. Parathyroid and Pancreas.
D. Thyroid and parathyroid.

Which of these symptoms is common in patients suffering from Diabetes Mellitus?
A. Hypophagia (lack of appetite).
B. Hypoglicemia (low blood sugar)
C. Polyuria (excessive urination).
D. Proteinuria (proteins in the urine).

The figure below shows the results of an experiment where human red blood cells were exposed to three saline solutions with different concentrations. Given the behavior of the cells (upper panel) and the movement of water across their membranes (lower panel), which of these statements is TRUE?
A. All three solutions have a similar concentration.
B. Solution A has the highest salt concentration.
C. Solution B has the highest salt concentration.
D. Solution C has the highest salt concentration.

Which of the following processes causes a DECREASE in blood pressure?
A. Reduced water reabsorption in the nephrons.
B. Release of renin in the kidney.
C. Release of aldosterone in the adrenal glands.
D. Vasoconstriction (narrowing of the blood vessels).

Willem was biking along is normal route to school when a speeding car came in his direction. He barely managed to avoid the collision and was still shaking from the scare when he entered the classroom. If you could test his blood before and after the incident, which of these hormones would have had a significant increase?
A. Adrenaline.
B. Calcitonin.
C. Melatonin.
D. Parathyroid hormone (PTH).

Which of the following sentences about steroid-based hormones is TRUE?
A. They are only found in the hypothalamus.
B. They are resistant to very low pH levels.
C. They can to cross cell membranes.
D. They regulate glucose levels in the blood.

Which of these blood components carries cholesterol to the liver?
A. Erythrocytes.
B. High-density lipoproteins (HDL).
C. Low-density lipoproteins (LDL).
D. Platelets.

The glomerular filtrate is the result of blood filtration in the kidneys, but not yet urine. Which of the following differences between glomerular filtrate and urine is FALSE?
A. In healthy individuals, only the glomerular filtrate contains glucose.
B. The body produces roughly 100x more glomerular filtrate than urine.
C. Urine has a lower pH than the glomerular filtrate.
D. Urine has more salt  than the glomerular filtrate.

One of the items of safety equipment of a spacecraft removes carbon dioxide from the inside to keep the environment healthy for the astronauts. After an accident happened, the equipment stopped working, what do you expect would happen to the pH level of the astronaut's blood?
A. The pH would decrease (acidosis).
B. The pH would increase (alkalosis).
C. The pH would remain the same (homeostasis).

Which of this conditions are characterized by the production of abnormal white blood cells?
A. Anemia.
B. Hemophilia.
C. Leukemia.
D. Puerperia.

What is the ureter?
A. A circular muscle that regulates the flow of urine into the outside of the body.
B. An expandable muscular sac that accumulates urine produced in the kidney.
C. A tube that carries urine from the kidneys to the urinary bladder.
D. A tube that carries urine from the urinary bladder to the outside of the body.

What is gluconeogenesis?
A. The breakdown of glycogen into glucose.
B. The formation of glycogen from glucose.
C. The production of glucose from fats and/or aminoacids.
D. The synthesis of aminoacids in the liver.

Our body can only synthesize 11 of the 20 standard aminoacids. If the diet is lacking some of the other nine aminoacids this means we might be unable to synthesize which of these organic compounds?
A. Carbohydrates.
B. Lipids.
C. Nucleic acids.
D. Proteins.

The figure below shows the results of a test to determine the blood type of a patient. Given the pattern of coagulation of the blood, what is the blood type of this patient?
A. The blood type is A+.
B. The blood type is AB+.
C. The blood type is B-.
D. The blood type is O-.

Which of these is an example of an hormonal stimuli regulating hormone release?
A. High levels of thyroid stimulating hormone (TSH) cause the release of T3 in the thyroid.
B. Low concentrations of calcium in the blood cause the release of parathyroid hormone (PTH) in the parathyroid glands.
C. The reception of light in the eyes regulates the release of melatonin in the pineal gland.
D. The thoracic splanchnic nerves stimulate the release of noradrenaline in the adrenal glands.

Why is it impossible for humans to survive at very high altitudes?
A. Air temperatures above 5000 m are too cold to sustain life.
B. Red blood cells burst due to low pressure and become unable to transport oxygen.
C. The atmosphere at high altitudes has a different mixture of gases, with a smaller percentage of oxygen, leading to suffocation.
D. The body reacts to low oxygen availability by increasing the amount of red blood cells, causing the blood to become too thick.

The thyroid gland produces two hormones Triiodothyronine (T3) and Thyroxine (T4) together know as thyroid hormones. Which of the following is NOT a physiological response to the release of these hormones?
A. Body temperature increases.
B. Mitochondria increase the rate of cellular respiration.
C. More glucose is consumed by the cells.
D. The pituitary gland increases the release of thyroid-stimulating hormone (TSH).

Which of these is the LOWEST level of organization in our body?
A. Cells.
B. Organelles.
C. Organs.
D. Systems.

The hormone hCG (human chorionic gonadotropin) is very important in the initial stages of pregnancy has it avoids menstruations, thus allowing the embryo to safely attach to the uterine wall. Where is it produced?
A. In the embryonic tissues (placenta).
B. In the ovaries.
C. In the pituitary gland.
D. In the uterus.

How do you call the process of filtrating the blood outside the body in patients suffering from renal failure?
A. Hematopoiesis.
B. Hematocrit.
C. Hemodialysis
D. Hemoglobin.

Which of the following sentences regarding kidney vascularization is CORRECT?
A. The afferent arteriole carries blood into the glomerulus.
B. The efferent arteriole branches into several interlobal arteries.
C. The renal vein carries blood into the kidney.
D. The segmental arteries are located in the renal cortex.

Which of following cases is an example of pinocytosis?
A. Detection of insulin by protein receptors in the membrane of muscle cells.
B. Diffusion of oxygen across the plasma membrane of red blood cells in the pulmonary alveoli.
C. Ingestion of bacteria by neutrophil white blood cells during an infectious process.
D. The uptake of extracellular fluids containing nutrients by cells of the intestinal wall.

Which of the following sentences regarding kidney anatomy is TRUE?
A. The nephrons are fully contained in the renal medula.
B. The outer lining of the kidney is known as renal cortex.
C. The renal pelvis collects the urine draining from the collecting ducts.
D. The thinner part of the kidney, where blood vessel go in and out, in called the renal pyramid.

As part of the monitoring of impacts caused by gas-drilling induced earthquakes in the province of Groningen, you were asked to measure the effect of these earthquakes on the long-term stress response of people living in the affected areas. Which of these hormones would you measure in those people?
A. Aldosterone.
B. Cortisone.
C. Glucagon.
D. Thyroxine (T4).

Which of the following is NOT a physiological function of the blood?
A. Coordination of body system responses.
B. Protection against infectious agents.
C. Regulation of body temperature.
D. Transport of nutrients and gases.

The sarcomeres are the functional units of the muscle.
A. True.
B. False.

Myosin heads need calcium ions to make a cross-bridge.
A. True.
B. False.

No ATP is required for an isometric muscle contraction.
A. True.
B. False.

Myoglobin ensures the supply of what in the muscles?
A. Blood.
B. Glycogen.
C. Oxygen.

How is lactate formed in the muscles?
A. By the aerobic metabolism.
B. By glycolysis.
C. By the splitting of creatine phosphate.

Aerobic metabolism CANNOT be combined with anaerobic metabolism in a muscle cell.
A. True.
B. False.

To run a marathon you benefit mostly from which of the following?
A. Creatine phosphate.
B. Glycolysis.
C. Krebs cycle/oxidative phosphorylation.

If a muscle's length remains the same, what type of contraction did it make?
A. Concentric.
B. Eccentric.
C. Isometric.

How do you call muscles that have the opposite working mechanism?
A. Agonists.
B. Antagonists.
C. Synergists.

Anaerobic endurance is the capacity of muscles to perform for a short period under which conditions?
A. Using only oxygen stored in the muscle cell.
B. With insufficiently supplied oxygen.
C. With sufficiently supplied oxygen.

The VO2max is the maximal oxygen consumption during incremental exercise. In which unit is it expressed?
A. ml.
B. ml/min.
C. ml/min per kg of body weight.

Which of the following is TRUE below the anaerobic threshold?
A. The muscle contains insufficient O2 for energy supply.
B. A lot of pyruvic acid is converted into lactate.
C. You can be in a steady state.

The figure below represents a synovial joint. What structure is represented by the number 4?
A. The capsule.
B. The cartilage.
C. The synovial membrane.

Which part of a joint is responsible for lubrication, nutrition and strength distribution?
A. The cartilage.
B. The periost.
C. The synovia.

What forms the inner lining of the joint capsule?
A. The cartilage.
B. The ligaments.
C. The synovial membrane.

What is the function of the ligaments in a joint?
A. Fixation of the hyaline cartilage.
B. Movement of the joint.
C. Reinforcement of the joint capsule.

The figure below represents a joint. This type of joint is an articulatio…
A. Ellipsoidea.
B. Ginglymus.
C. Sellaris.

What type of joint is the elbow joint?
A. Ball-and-socket.
B. Complex.
C. Pivot.

Which of these processes results in the acidification of the muscle?
A. ATP spliting.
B. ATP synthesis.
C. Lactate production.

Which of the following should be consumed to prevent fatigue during activity?
A. Fats.
B. Foods with a high glycemic index.
C. Proteins.

How do you call a joint based on a link with connective tissue between two bones?
A. Synchondrosis.
B. Syndesmosis.
C. Synostosis.

Which of the following is a capacity vessel?
A. A capillary.
B. A vein.
C. An artery.

In which type of blood vessel will you find valves?
A. In arteries.
B. In capillaries.
C. In veins.

How are substances transported over the capillary wall?
A. Only by diffusion.
B. Only by filtration.
C. By both diffusion and filtration.

Relatively speaking, arterioles have the largest amount of smooth muscle tissue among all blood vessels.
A. True.
B. False.

Where is the smooth muscle tissue of the vascular walls located?
A. In the tunica adventitia.
B. In the tunica media.
C. In the tunica intima.

Which muscle fibers are wired by the most capillaries?
A. Heart muscle fibres.
B. Red muscle fibres.
C. White muscle fibres.

The figure below represents the heart and its main blood vessels. Which blood vessel is represented by the letter A?
A. Aorta.
B. A. pulmonaris.
C. V. pulmonaris.

According to the Frank-Starling effect, what happens to the beat volume when the filling of the ventricles increases?
A. It decreases.
B. It increases.
C. It remains the same.

The cardiac output is the volume of blood ejected by the heart per minute. It equals which of the following options?
A. Beat volume at rest.
B. Beat volume of the left ventricle.
C. Beat volume times the heart frequency.

Electric stimuli pass the bundle of His on their way to where?
A. To the AV node.
B. To the Purkinje fibres.
C. To the SA node.

What effect does the sympathetic nervous system have on the heart frequency?
A. It has no influence on heart frequency.
B. It increases the heart frequency.
C. It lowers the heart frequency.

What is the consequence of exertion on the QRS complex?
A. The complex becomes higher.
B. The complex becomes wider.
C. The number of complexes increases.

What happens to blood pressure during exercise?
A. It drops.
B. It remains the same.
C. It rises.

Which of the following is the most important respiratory muscle?
A. The diaphragm.
B. The m. intercostalis externus.
C. The m rectus abdominis.

Which of the following is TRUE regarding relaxed respiration?
A. It is a passive event.
B. It requires contraction of the diaphragm.
C. It requires contraction of the mm. intercostales.

The wall of a pulmonary alveolus has a thickness of a single cell layer.
A. True.
B. False.

All pulmonary alveoli are encompassed by capillaries.
A. True.
B. False.

Where is the respiratory regulation center located?
A. In the brain cortex.
B. In the brain stem.
C. In the spinal cord.

The figure below represents part of the respiratory system. Which number corresponds to the bifurcation?
A. 3.
B. 4.
C. 6.
D. 7."""

# Answers
answers = ['D','B','A','A','B','B','C','B','D','D','B','C','C','C','D','D','C','B','A','A','C','B','D','A','C','C','C','D','A','A','D','D','B','A','C','A','D','C','B','A','A','A','B','C','B','B','C','C','B','B','C','C','B','C','C','C','B','B','A','B','B','B','C','C','A','B','A','A','B','C','B','B','C','C','A','A','A','A','B','B']

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
            if len(current_q["options"]) == 2 and "True" in current_q["options"][0] and "False" in current_q["options"][1]:
                q_type = "true-false"
            elif len(current_q["options"]) <= 3 and not any('.' in opt for opt in current_q["options"]):
                q_type = "multiple-choice"
            else:
                q_type = "multiple-choice"
            
            questions.append({
                "id": q_num + 80,  # Start at 81 (after Exam 1)
                "exam": "Exam 2",
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
        "id": q_num + 80,
        "exam": "Exam 2",
        "type": "true-false" if len(current_q["options"]) == 2 else "multiple-choice",
        "question": current_q["question"],
        "image": None if "figure below" not in current_q["question"].lower() and "picture below" not in current_q["question"].lower() else "Image required",
        "options": current_q["options"],
        "correct": answers[q_num-1] if q_num <= len(answers) else "A",
        "explanation": None,
        "originalNumber": q_num
    })

# Save to JSON
with open('exam2_parsed.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"✅ Parsed {len(questions)} questions from Exam 2")
print(f"📄 Saved to: exam2_parsed.json")
