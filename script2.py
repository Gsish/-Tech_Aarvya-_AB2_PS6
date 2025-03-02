import requests
from bs4 import BeautifulSoup
import socks
import socket
import smtplib
import re
import time
import schedule
import spacy
import argparse
import json
import logging
import os
import csv
import concurrent.futures
import hashlib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from tqdm import tqdm
from cryptography.fernet import Fernet

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("darkweb_monitor.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("darkweb_monitor")

class DarkWebMonitor:
    def __init__(self, config_path=None):
        """Initialize the Dark Web Monitor with optional configuration file."""
        # Load Spacy NER Model
        try:
            self.nlp = spacy.load("en_core_web_sm")
            logger.info("NLP engine loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load NLP engine: {e}")
            logger.info("Downloading NLP model...")
            spacy.cli.download("en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")
        
        # Load configuration
        self.config = self.load_config(config_path)
        
        # Setup Tor connection
        self.setup_tor()
        
        # Create encryption key if it doesn't exist
        self.setup_encryption()
        
        # Create directories if they don't exist
        self.create_directories()

    def load_config(self, config_path):
        """Load configuration from file or use defaults."""
        default_config = {
            "tor_proxy_host": "127.0.0.1",
            "tor_proxy_port": 9050,
            "search_engines": [
                "https://ahmia.fi/search/?q=",
                "https://darksearch.io/search?query="
            ],
            "dark_web_sites": [
                "http://nzxj65x32vh2fkhk.onion",
                "http://pastyjv6xhjylyuk.onion",
                "http://hss3uro2hsxfogfq.onion",
                "http://dnmugz73ivcswgyv.onion",
                "http://hxt254aygrsziejn.onion"
            ],
            "search_terms": [
                "database leak", "breach", "hacked data", "password dump", 
                "company hacked", "data exposed", "credential leak",
                "customer data", "credit card dump", "sensitive information"
            ],
            "monitoring_interval_minutes": 30,
            "request_timeout": 25,
            "max_concurrent_requests": 5,
            "user_agents": [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
            ],
            "email_notifications": False,
            "sender_email": "",
            "receiver_email": "",
            "email_password": "",
            "smtp_server": "smtp.gmail.com",
            "smtp_port": 587,
            "webhook_notifications": False,
            "webhook_url": "",
            "companies_to_monitor": []
        }
        
        if config_path and os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    user_config = json.load(f)
                    # Merge user config with defaults
                    for key, value in user_config.items():
                        default_config[key] = value
                logger.info(f"Configuration loaded from {config_path}")
            except Exception as e:
                logger.error(f"Error loading configuration: {e}")
        
        return default_config

    def setup_tor(self):
        """Configure Tor proxy connection."""
        try:
            socks.set_default_proxy(
                socks.SOCKS5, 
                self.config["tor_proxy_host"], 
                self.config["tor_proxy_port"]
            )
            socket.socket = socks.socksocket
            logger.info("Tor proxy configured successfully")
            
            # Test Tor connection
            test_url = "https://check.torproject.org/"
            response = requests.get(test_url, timeout=self.config["request_timeout"])
            if "Congratulations" in response.text:
                logger.info("Tor connection confirmed and working properly")
            else:
                logger.warning("Tor connection may not be working properly")
        except Exception as e:
            logger.error(f"Failed to configure Tor: {e}")
            logger.warning("Continuing without Tor. Some .onion sites will be inaccessible")

    def setup_encryption(self):
        """Setup encryption for sensitive data storage."""
        key_file = "encryption.key"
        if not os.path.exists(key_file):
            key = Fernet.generate_key()
            with open(key_file, "wb") as f:
                f.write(key)
            logger.info("Generated new encryption key")
        else:
            with open(key_file, "rb") as f:
                key = f.read()
        
        self.cipher = Fernet(key)
        logger.info("Encryption setup complete")

    def create_directories(self):
        """Create necessary directories for data storage."""
        dirs = ["data", "reports", "logs"]
        for dir_name in dirs:
            os.makedirs(dir_name, exist_ok=True)
        logger.info("Created necessary directories")

    def get_random_user_agent(self):
        """Return a random user agent from the config."""
        import random
        return random.choice(self.config["user_agents"])

    def search_for_leaks(self, engine_url, keyword, company):
        """Search a specific search engine for leaked data URLs."""
        search_query = f"{keyword} {company}"
        logger.debug(f"Searching {engine_url} for: {search_query}")
        
        try:
            headers = {"User-Agent": self.get_random_user_agent()}
            response = requests.get(
                engine_url + search_query, 
                headers=headers, 
                timeout=self.config["request_timeout"]
            )
            
            if response.status_code != 200:
                logger.warning(f"Got status code {response.status_code} from {engine_url}")
                return []
                
            soup = BeautifulSoup(response.text, "html.parser")
            urls = [a["href"] for a in soup.find_all("a", href=True) 
                   if ("http" in a["href"] and 
                       not any(excluded in a["href"] for excluded in ["google", "facebook", "twitter"]))]
            
            logger.info(f"Found {len(urls)} potential URLs from {engine_url}")
            return urls
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error when searching {engine_url}: {e}")
            return []
        except Exception as e:
            logger.error(f"Error searching {engine_url}: {e}")
            return []

    def scrape_site_for_leaks(self, url, company):
        """Scrape a site for sensitive data related to the company."""
        logger.debug(f"Scraping: {url}")
        
        try:
            headers = {"User-Agent": self.get_random_user_agent()}
            response = requests.get(
                url, 
                headers=headers, 
                timeout=self.config["request_timeout"]
            )
            
            if response.status_code != 200:
                return None
                
            text = response.text.lower()
            company_lower = company.lower()
            
            # Check if the company name appears in the text
            if company_lower not in text:
                return None
                
            # Check for sensitive data leak indicators
            leak_indicators = [
                "password", "email", "leaked data", "database dump", 
                "breach", "exposed", "credentials", "dump", "sensitive",
                "personal data", "credit card", "financial"
            ]
            
            if any(indicator in text for indicator in leak_indicators):
                # Calculate content hash to avoid duplicates
                content_hash = hashlib.md5(text.encode()).hexdigest()
                
                # Extract relevant text snippets
                relevant_snippets = []
                paragraphs = re.split(r'\n+', text)
                for para in paragraphs:
                    if company_lower in para and any(indicator in para for indicator in leak_indicators):
                        relevant_snippets.append(para)
                
                return {
                    "url": url,
                    "content_hash": content_hash,
                    "discovery_time": datetime.now().isoformat(),
                    "relevant_snippets": relevant_snippets[:5]  # Limit to 5 snippets
                }
        except requests.exceptions.RequestException:
            return None
        except Exception as e:
            logger.error(f"Error scraping {url}: {e}")
            return None
            
        return None

    def extract_sensitive_info(self, text, company):
        """Use Named Entity Recognition (NER) and regex to extract sensitive information."""
        # Extract emails using regex
        emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
        
        # Use NER for other entity types
        doc = self.nlp(text[:1000000])  # Limit text size to avoid memory issues
        
        entities = {
            "EMAIL": set(emails),
            "PERSON": set(),
            "ORG": set(),
            "MONEY": set(),
            "GPE": set(),  # Geo-Political Entity
            "CARDINAL": set(),  # Numbers
        }
        
        for ent in doc.ents:
            if ent.label_ in entities:
                entities[ent.label_].add(ent.text)
        
        # Look for potential password patterns
        passwords = re.findall(r'\b[A-Za-z0-9!@#$%^&*()_+]{8,20}\b', text)
        
        # Convert sets to lists for JSON serialization
        result = {k: list(v) for k, v in entities.items()}
        result["POTENTIAL_PASSWORDS"] = passwords[:10]  # Limit to 10 potential passwords
        
        return result

    def send_email_alert(self, company, leak_data):
        """Send an email alert when a leak is detected."""
        if not self.config.get("email_notifications", False):
            return
            
        sender_email = self.config.get("sender_email")
        receiver_email = self.config.get("receiver_email")
        email_password = self.config.get("email_password")
        smtp_server = self.config.get("smtp_server")
        smtp_port = self.config.get("smtp_port")
        
        if not all([sender_email, receiver_email, email_password, smtp_server, smtp_port]):
            logger.error("Email configuration incomplete. Check configuration file.")
            return
            
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = receiver_email
        msg["Subject"] = f"⚠️ Data Leak Alert for {company}"
        
        # Create email body
        body = f"""
        ⚠️ POTENTIAL DATA LEAK DETECTED ⚠️
        
        Company: {company}
        Detection Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        
        Leaked Sources:
        """
        
        for leak in leak_data:
            body += f"\n- {leak['url']}\n"
            if leak.get("relevant_snippets"):
                body += "  Relevant snippets:\n"
                for snippet in leak["relevant_snippets"]:
                    body += f"  • {snippet[:100]}...\n"
        
        if leak_data[0].get("extracted_info"):
            body += "\nExtracted Information:\n"
            for type_name, items in leak_data[0]["extracted_info"].items():
                if items:
                    body += f"\n{type_name}:\n"
                    for item in items[:5]:
                        body += f"• {item}\n"
        
        body += """
        
        IMPORTANT: This is an automated alert. Please investigate these findings further to confirm the leak.
        Some information may be false positives.
        
        """
        
        msg.attach(MIMEText(body, "plain"))
        
        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, email_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
            server.quit()
            logger.info("Alert email sent successfully")
        except Exception as e:
            logger.error(f"Failed to send email: {e}")

    def send_webhook_notification(self, company, leak_data):
        """Send a webhook notification when a leak is detected."""
        if not self.config.get("webhook_notifications", False) or not self.config.get("webhook_url"):
            return
            
        webhook_url = self.config["webhook_url"]
        
        payload = {
            "company": company,
            "detection_time": datetime.now().isoformat(),
            "leak_count": len(leak_data),
            "leaks": leak_data
        }
        
        try:
            response = requests.post(
                webhook_url,
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            if response.status_code == 200:
                logger.info("Webhook notification sent successfully")
            else:
                logger.error(f"Webhook notification failed with status code {response.status_code}")
        except Exception as e:
            logger.error(f"Failed to send webhook notification: {e}")

    def save_leak_data(self, company, leak_data):
        """Save leak data to disk in encrypted form."""
        if not leak_data:
            return
            
        # Create company directory
        company_dir = os.path.join("data", self.sanitize_filename(company))
        os.makedirs(company_dir, exist_ok=True)
        
        # Generate filename based on date
        date_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(company_dir, f"leak_{date_str}.json")
        
        # Encrypt and save the data
        try:
            json_data = json.dumps(leak_data)
            encrypted_data = self.cipher.encrypt(json_data.encode())
            
            with open(filename, "wb") as f:
                f.write(encrypted_data)
                
            logger.info(f"Leak data saved to {filename}")
            
            # Also save a CSV report of URLs
            report_file = os.path.join("reports", f"{company}_{date_str}_report.csv")
            with open(report_file, "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(["URL", "Discovery Time", "Content Hash"])
                for leak in leak_data:
                    writer.writerow([
                        leak["url"],
                        leak.get("discovery_time", "Unknown"),
                        leak.get("content_hash", "Unknown")
                    ])
                    
            logger.info(f"Summary report saved to {report_file}")
        except Exception as e:
            logger.error(f"Error saving leak data: {e}")

    def sanitize_filename(self, filename):
        """Sanitize a string to be used as a filename."""
        return re.sub(r'[^\w\-_.]', '_', filename)

    def monitor_company(self, company):
        """Monitor dark web for leaks related to a specific company."""
        logger.info(f"Scanning Dark Web for leaks related to {company}...")
        
        all_search_urls = []
        
        # Search through configured search engines
        for engine in self.config["search_engines"]:
            for term in self.config["search_terms"]:
                urls = self.search_for_leaks(engine, term, company)
                all_search_urls.extend(urls)
                
                # Add a small delay to avoid overloading search engines
                time.sleep(1)
        
        # Add known dark web sites
        all_search_urls.extend(self.config["dark_web_sites"])
        
        # Remove duplicates
        all_search_urls = list(set(all_search_urls))
        logger.info(f"Found {len(all_search_urls)} unique URLs to check")
        
        # Scrape URLs for leaks using parallel processing
        leaked_data = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.config["max_concurrent_requests"]) as executor:
            future_to_url = {
                executor.submit(self.scrape_site_for_leaks, url, company): url 
                for url in all_search_urls
            }
            
            for future in tqdm(concurrent.futures.as_completed(future_to_url), 
                              total=len(all_search_urls),
                              desc=f"Scanning for {company}"):
                url = future_to_url[future]
                try:
                    result = future.result()
                    if result:
                        leaked_data.append(result)
                except Exception as e:
                    logger.error(f"Error processing {url}: {e}")
        
        # Extract information from the first few leaks
        if leaked_data:
            logger.warning(f"⚠️ POTENTIAL LEAK DETECTED! Found {len(leaked_data)} potential leaks for {company}")
            
            # Concatenate relevant snippets for analysis
            all_text = ""
            for leak in leaked_data[:5]:  # Analyze only first 5 leaks
                if leak.get("relevant_snippets"):
                    all_text += " ".join(leak["relevant_snippets"])
            
            # Extract sensitive information
            extracted_info = self.extract_sensitive_info(all_text, company)
            
            # Add extracted info to first leak item (for notifications)
            if leaked_data:
                leaked_data[0]["extracted_info"] = extracted_info
            
            # Send notifications
            self.send_email_alert(company, leaked_data)
            self.send_webhook_notification(company, leaked_data)
            
            # Save data
            self.save_leak_data(company, leaked_data)
            
            return True
        else:
            logger.info(f"No leaks found for {company}")
            return False
            
    def load_scan_history(self):
        """Load scan history from disk."""
        history_file = os.path.join("data", "scan_history.json")
        if os.path.exists(history_file):
            try:
                with open(history_file, "r") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}
        
    def save_scan_history(self, history):
        """Save scan history to disk."""
        history_file = os.path.join("data", "scan_history.json")
        try:
            with open(history_file, "w") as f:
                json.dump(history, f)
        except Exception as e:
            logger.error(f"Error saving scan history: {e}")
    
    def run_monitoring(self):
        """Run monitoring for all configured companies."""
        companies = self.config.get("companies_to_monitor", [])
        if not companies:
            logger.warning("No companies configured for monitoring")
            return
            
        logger.info(f"Starting monitoring cycle for {len(companies)} companies")
        
        # Load scan history
        scan_history = self.load_scan_history()
        
        for company in companies:
            # Check if we've found leaks for this company recently
            last_found = scan_history.get(company, {}).get("last_leak_found")
            if last_found:
                last_found_time = datetime.fromisoformat(last_found)
                hours_since_last = (datetime.now() - last_found_time).total_seconds() / 3600
                
                # If we found a leak in the last 6 hours, skip this company
                if hours_since_last < 6:
                    logger.info(f"Skipping {company} - leak found {hours_since_last:.1f} hours ago")
                    continue
            
            # Run monitoring for this company
            scan_start = datetime.now()
            found_leak = self.monitor_company(company)
            scan_end = datetime.now()
            
            # Update scan history
            if company not in scan_history:
                scan_history[company] = {}
                
            scan_history[company]["last_scan"] = scan_end.isoformat()
            scan_history[company]["scan_count"] = scan_history[company].get("scan_count", 0) + 1
            
            if found_leak:
                scan_history[company]["last_leak_found"] = scan_end.isoformat()
                scan_history[company]["total_leaks_found"] = scan_history[company].get("total_leaks_found", 0) + 1
                
            # Save scan history
            self.save_scan_history(scan_history)
            
            # Pause between companies to avoid overwhelming Tor network
            time.sleep(5)
            
        logger.info(f"Monitoring cycle completed for {len(companies)} companies")


def create_default_config(config_path):
    """Create a default configuration file if it doesn't exist."""
    if os.path.exists(config_path):
        return
        
    default_config = {
        "tor_proxy_host": "127.0.0.1",
        "tor_proxy_port": 9050,
        "search_engines": [
            "https://ahmia.fi/search/?q=",
            "https://darksearch.io/search?query="
        ],
        "dark_web_sites": [
            "http://nzxj65x32vh2fkhk.onion",
            "http://pastyjv6xhjylyuk.onion",
            "http://hss3uro2hsxfogfq.onion"
        ],
        "search_terms": [
            "database leak", "breach", "hacked data", "password dump", 
            "company hacked", "data exposed", "credential leak",
            "customer data"
        ],
        "monitoring_interval_minutes": 30,
        "request_timeout": 25,
        "max_concurrent_requests": 5,
        "user_agents": [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15"
        ],
        "email_notifications": False,
        "sender_email": "your_email@gmail.com",
        "receiver_email": "your_email@gmail.com",
        "email_password": "your_password",
        "smtp_server": "smtp.gmail.com",
        "smtp_port": 587,
        "webhook_notifications": False,
        "webhook_url": "",
        "companies_to_monitor": []
    }
    
    try:
        with open(config_path, 'w') as f:
            json.dump(default_config, f, indent=2)
        logger.info(f"Created default configuration file at {config_path}")
    except Exception as e:
        logger.error(f"Failed to create default configuration: {e}")


def main():
    """Main function to run the dark web monitor."""
    parser = argparse.ArgumentParser(description="Dark Web Monitor for data leaks")
    parser.add_argument("-c", "--config", default="config.json", help="Path to configuration file")
    parser.add_argument("--create-config", action="store_true", help="Create a default configuration file")
    parser.add_argument("-t", "--test", help="Test monitoring for a specific company", metavar="COMPANY")
    parser.add_argument("--add-company", help="Add a company to monitor", metavar="COMPANY")
    parser.add_argument("--list-companies", action="store_true", help="List companies being monitored")
    parser.add_argument("--set-email", nargs=3, metavar=("EMAIL", "PASSWORD", "RECIPIENT"), 
                        help="Set email notification settings")
    parser.add_argument("--interval", type=int, help="Set monitoring interval in minutes")
    
    args = parser.parse_args()
    
    # Create default config if requested or if it doesn't exist and no other operation specified
    if args.create_config or (not os.path.exists(args.config) and not any([
            args.test, args.add_company, args.list_companies, args.set_email, args.interval
        ])):
        create_default_config(args.config)
        if args.create_config:
            print(f"Created default configuration file at {args.config}")
            print("Please edit this file to add your companies and configure notifications.")
            return
    
    # Create monitor instance
    monitor = DarkWebMonitor(args.config)
    
    # Handle commands
    if args.add_company:
        if args.add_company not in monitor.config.get("companies_to_monitor", []):
            if "companies_to_monitor" not in monitor.config:
                monitor.config["companies_to_monitor"] = []
            monitor.config["companies_to_monitor"].append(args.add_company)
            
            # Save updated config
            try:
                with open(args.config, "w") as f:
                    json.dump(monitor.config, f, indent=2)
                print(f"Added {args.add_company} to monitored companies")
            except Exception as e:
                print(f"Error saving config: {e}")
    
    elif args.list_companies:
        companies = monitor.config.get("companies_to_monitor", [])
        if companies:
            print("Currently monitoring these companies:")
            for i, company in enumerate(companies, 1):
                print(f"{i}. {company}")
        else:
            print("No companies configured for monitoring")
    
    elif args.set_email:
        monitor.config["email_notifications"] = True
        monitor.config["sender_email"] = args.set_email[0]
        monitor.config["email_password"] = args.set_email[1]
        monitor.config["receiver_email"] = args.set_email[2]
        
        try:
            with open(args.config, "w") as f:
                json.dump(monitor.config, f, indent=2)
            print("Email notification settings updated")
        except Exception as e:
            print(f"Error saving config: {e}")
    
    elif args.interval:
        monitor.config["monitoring_interval_minutes"] = args.interval
        try:
            with open(args.config, "w") as f:
                json.dump(monitor.config, f, indent=2)
            print(f"Monitoring interval set to {args.interval} minutes")
        except Exception as e:
            print(f"Error saving config: {e}")
    
    elif args.test:
        print(f"Running test scan for {args.test}...")
        monitor.monitor_company(args.test)
    
    else:
        # Normal operation - start monitoring schedule
        interval_minutes = monitor.config.get("monitoring_interval_minutes", 30)
        companies = monitor.config.get("companies_to_monitor", [])
        
        if not companies:
            print("No companies configured for monitoring. Use --add-company to add companies.")
            return
            
        print(f"🚀 Dark Web Monitoring started! Running every {interval_minutes} minutes for {len(companies)} companies.")
        print("Press Ctrl+C to stop.")
        
        # Schedule monitoring
        schedule.every(interval_minutes).minutes.do(monitor.run_monitoring)
        
        # Run once immediately
        monitor.run_monitoring()
        
        # Keep running
        try:
            while True:
                schedule.run_pending()
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Monitoring stopped by user")


if __name__ == "__main__":
    main()
