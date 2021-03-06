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
        self.base_url = "http://swethepeople.me/"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_splash_page(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_class_name('slick-next')
        driver.find_element_by_class_name('slick-next')
        driver.find_element_by_class_name('slick-prev')
        driver.find_element_by_class_name('slick-prev')
        driver.find_element_by_link_text("Representatives").click()

    def test_about_page(self):
        driver = self.driver
        driver.get(self.base_url + 'about')
        driver.find_element_by_class_name('link-box')
        driver.find_element_by_class_name('tools-card')
        driver.find_element_by_link_text("Technical Report")
        driver.find_element_by_link_text("API Documentation")

    def test_representative_model(self):
        driver = self.driver
        driver.get(self.base_url + 'representatives')
        driver.find_element_by_class_name('tile').click()
        driver.back()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a[2]/div/div/div/h3").click()
        driver.find_element_by_id("uncontrolled-tab-example-tab-2").click()
        driver.find_element_by_id("uncontrolled-tab-example-tab-3").click()
        driver.find_element_by_id("uncontrolled-tab-example-tab-4").click()
        driver.find_element_by_link_text("Website").click()

    def test_district_model(self):
        driver = self.driver
        driver.get(self.base_url + 'districts')
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a/div").click()
        driver.back()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div[2]/a/div").click()
        driver.back()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div[4]/a/div").click()
        driver.find_element_by_id("uncontrolled-tab-example-tab-2").click()
        driver.find_element_by_id("uncontrolled-tab-example-tab-3").click()
        driver.find_element_by_id("uncontrolled-tab-example-tab-4").click()
        driver.find_element_by_id("uncontrolled-tab-example-tab-5").click()

    def test_party_model(self):
        driver = self.driver
        driver.get(self.base_url + 'parties')
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/a/div").click()
        driver.back()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div[2]/a/div").click()
        driver.back()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div[3]/a/div").click()

    def test_representative_model_to_party_model(self):
        driver = self.driver
        driver.get(self.base_url + 'representatives')
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a[2]/div/div/div/h4[2]").click()
        driver.find_element_by_link_text("Democratic Party").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[3]/div/div/div/div[7]/a/div/div/div").click()

    def test_representative_model_to_district_model(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_link_text("Representatives").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a[2]/div/div/div").click()
        driver.find_element_by_link_text("12").click()
        driver.find_element_by_link_text("Representatives").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a/div/div/div/h3").click()
        driver.find_element_by_link_text("5").click()

    def test_history(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_link_text("Representatives").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a[2]/div/div/div").click()
        driver.back()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a[3]/div/div/div/h4[2]/i").click()
        driver.back()
        driver.find_element_by_link_text("Districts").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div[3]/a/div").click()
        driver.back()
        driver.forward()

    def test_navigation(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_link_text("Representatives").click()
        driver.find_element_by_link_text("Parties").click()
        driver.find_element_by_link_text("Districts").click()
        driver.find_element_by_link_text("About").click()
        driver.find_element_by_link_text("Districts").click()

    def test_search_representative(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_xpath("//input[@type='text']").click()
        driver.find_element_by_xpath("//input[@type='text']").clear()
        driver.find_element_by_xpath("//input[@type='text']").send_keys("Paul Ryan")
        driver.find_element_by_xpath("//button[@type='submit']").click()

    def test_search_party(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_xpath("//input[@type='text']").click()
        driver.find_element_by_xpath("//input[@type='text']").clear()
        driver.find_element_by_xpath("//input[@type='text']").send_keys("green")
        driver.find_element_by_xpath("//button[@type='submit']").click()

    def test_search_district(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_xpath("//input[@type='text']").click()
        driver.find_element_by_xpath("//input[@type='text']").clear()
        driver.find_element_by_xpath("//input[@type='text']").send_keys("wisconsin 2")
        driver.find_element_by_xpath("//button[@type='submit']").click()

    def test_filter(self):
        driver = self.driver
        driver.get(self.base_url + 'representatives')
        driver.find_element_by_class_name("party-filter").click()
        driver.find_element_by_class_name("sort").click()
        driver.find_element_by_class_name("state-filter").click()
        driver.find_element_by_class_name("vote-filter").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a[2]/div/div/div").click()
        driver.find_element_by_link_text("Parties").click()
        driver.find_element_by_class_name("social-filter").click()
        driver.find_element_by_class_name("color-filter").click()
        driver.find_element_by_class_name("formation-filter").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/a/div").click()
        driver.find_element_by_xpath("//img[@alt='democratic_party']").click()
        driver.find_element_by_link_text("Districts").click()
        driver.find_element_by_class_name("state-filter").click()
        driver.find_element_by_class_name("pop-filter").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div[4]/a/div").click()

    def test_sort(self):
        driver = self.driver
        driver.get(self.base_url + 'representatives')
        driver.find_element_by_class_name("sort").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a[2]/div/div/div").click()
        driver.find_element_by_link_text("Parties").click()
        driver.find_element_by_class_name("sort").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/a/div").click()
        driver.find_element_by_link_text("Districts").click()
        driver.find_element_by_class_name("sort").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div[4]/a/div").click()

    def test_full_acceptance(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_xpath("(//button[@type='button'])[3]").click()
        driver.find_element_by_xpath("(//button[@type='button'])[3]").click()
        driver.find_element_by_link_text("Representatives").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a[2]/div/div/div").click()
        driver.find_element_by_link_text("Website").click()
        driver.find_element_by_link_text("12").click()
        driver.find_element_by_link_text("About").click()

    def test_pagination(self):
        driver = self.driver
        driver.get(self.base_url + 'representatives')
        driver.find_element_by_link_text("2").click()
        driver.find_element_by_link_text("3").click()
        driver.find_element_by_link_text("18").click()
        driver.find_element_by_xpath("//div[@id='root']/div/div[2]/div[2]/div/div/a[22]/div/div/div/h4").click()

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
