from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()

driver.get("http://localhost:5173/predict")

wait = WebDriverWait(driver, 15)

print("Filling form (MALE)...")

# -------- BASIC INFO --------
# Gender = male
gender = Select(wait.until(EC.presence_of_element_located((By.ID, "gender"))))
gender.select_by_value("male")

# Age
wait.until(EC.presence_of_element_located((By.ID, "Age"))).send_keys("30")

# -------- DIABETES INPUTS --------
wait.until(EC.presence_of_element_located((By.ID, "Glucose"))).send_keys("120")
driver.find_element(By.ID, "BloodPressure").send_keys("80")
driver.find_element(By.ID, "Insulin").send_keys("85")
driver.find_element(By.ID, "BMI").send_keys("23")

time.sleep(2)

print("Clicking Predict...")

# Click submit
driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

# Extra click for React (safe fallback)
driver.execute_script("document.querySelector('button[type=submit]').click()")

print("Waiting for result...")

time.sleep(10)

# Screenshot for report
driver.save_screenshot("male_test_result.png")
print("Screenshot saved!")

# Keep open
input("Press Enter to close browser...")

driver.quit()