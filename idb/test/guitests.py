# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class AcceptanceTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "https://www.katalon.com/"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_acceptance(self):
        driver = self.driver
        driver.get("http://swethepeople.me/")
        driver.find_element_by_xpath("(//button[@type='button'])[3]").click()
        driver.find_element_by_xpath("(//button[@type='button'])[2]").click()
        driver.find_element_by_link_text("Representatives").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div/div/div[4]/a/div/div/h3").click()
        driver.find_element_by_link_text("12").click()
        driver.find_element_by_link_text("Parties").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div/a/div/div/div/div[2]/p").click()
        driver.find_element_by_xpath("//img[contains(@src,'https://theunitedstates.io/images/congress/225x275/B001292.jpg')]").click()
        driver.find_element_by_link_text("About").click()
        driver.find_element_by_link_text("Home").click()
        # Go back in browser, shouldn't break
        driver.execute_script("window.history.go(-1)")
        driver.find_element_by_link_text("Parties").click()
        # Go forward in browser, shouldn't break
        driver.execute_script("window.history.go(-1)")
        driver.find_element_by_link_text("Home").click()
        driver.find_element_by_xpath("(//button[@type='button'])[3]").click()
        driver.find_element_by_xpath("(//button[@type='button'])[2]").click()

    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True

    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True

    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
