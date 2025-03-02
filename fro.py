import tkinter as tk
from tkinter import ttk, messagebox, simpledialog, filedialog
import json
import os
import threading
from script2 import DarkWebMonitor, create_default_config

class DarkWebMonitorUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Dark Web Monitor")
        self.root.geometry("600x400")
        self.root.resizable(False, False)

        self.config_path = "config.json"
        self.monitor = DarkWebMonitor(self.config_path)

        self.create_widgets()

    def create_widgets(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))

        # Config file path entry
        self.config_label = ttk.Label(main_frame, text="Config File:")
        self.config_label.grid(row=0, column=0, sticky=tk.W, pady=5)

        self.config_entry = ttk.Entry(main_frame, width=50)
        self.config_entry.insert(0, self.config_path)
        self.config_entry.grid(row=0, column=1, sticky=tk.W, pady=5)

        self.browse_button = ttk.Button(main_frame, text="Browse", command=self.browse_config_file)
        self.browse_button.grid(row=0, column=2, sticky=tk.W, pady=5)

        # Add company button
        self.add_company_button = ttk.Button(main_frame, text="Add Company to Monitor", command=self.add_company)
        self.add_company_button.grid(row=1, column=0, columnspan=3, sticky=tk.W, pady=5)

        # List companies button
        self.list_companies_button = ttk.Button(main_frame, text="List Monitored Companies", command=self.list_companies)
        self.list_companies_button.grid(row=2, column=0, columnspan=3, sticky=tk.W, pady=5)

        # Set email notifications button
        self.set_email_button = ttk.Button(main_frame, text="Set Email Notifications", command=self.set_email_notifications)
        self.set_email_button.grid(row=3, column=0, columnspan=3, sticky=tk.W, pady=5)

        # Set monitoring interval button
        self.set_interval_button = ttk.Button(main_frame, text="Set Monitoring Interval", command=self.set_monitoring_interval)
        self.set_interval_button.grid(row=4, column=0, columnspan=3, sticky=tk.W, pady=5)

        # Run test scan button
        self.test_scan_button = ttk.Button(main_frame, text="Run Test Scan", command=self.run_test_scan)
        self.test_scan_button.grid(row=5, column=0, columnspan=3, sticky=tk.W, pady=5)

        # Start monitoring button
        self.start_monitoring_button = ttk.Button(main_frame, text="Start Monitoring", command=self.start_monitoring)
        self.start_monitoring_button.grid(row=6, column=0, columnspan=3, sticky=tk.W, pady=5)

        # Stop monitoring button
        self.stop_monitoring_button = ttk.Button(main_frame, text="Stop Monitoring", command=self.stop_monitoring, state=tk.DISABLED)
        self.stop_monitoring_button.grid(row=7, column=0, columnspan=3, sticky=tk.W, pady=5)

        # Status label
        self.status_label = ttk.Label(main_frame, text="Status: Not Monitoring", foreground="red")
        self.status_label.grid(row=8, column=0, columnspan=3, sticky=tk.W, pady=5)

        self.monitoring_thread = None

    def browse_config_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
        if file_path:
            self.config_path = file_path
            self.config_entry.delete(0, tk.END)
            self.config_entry.insert(0, self.config_path)
            self.monitor = DarkWebMonitor(self.config_path)

    def add_company(self):
        company = simpledialog.askstring("Add Company", "Enter the name of the company to monitor:")
        if company:
            if company not in self.monitor.config.get("companies_to_monitor", []):
                if "companies_to_monitor" not in self.monitor.config:
                    self.monitor.config["companies_to_monitor"] = []
                self.monitor.config["companies_to_monitor"].append(company)

                # Save updated config
                try:
                    with open(self.config_path, "w") as f:
                        json.dump(self.monitor.config, f, indent=2)
                    messagebox.showinfo("Success", f"Added {company} to monitored companies")
                except Exception as e:
                    messagebox.showerror("Error", f"Error saving config: {e}")
            else:
                messagebox.showinfo("Info", f"{company} is already being monitored")

    def list_companies(self):
        companies = self.monitor.config.get("companies_to_monitor", [])
        if companies:
            companies_list = "\n".join(companies)
            messagebox.showinfo("Monitored Companies", f"Currently monitoring these companies:\n{companies_list}")
        else:
            messagebox.showinfo("Monitored Companies", "No companies configured for monitoring")

    def set_email_notifications(self):
        sender_email = simpledialog.askstring("Email Notifications", "Enter sender email:")
        email_password = simpledialog.askstring("Email Notifications", "Enter email password:", show='*')
        receiver_email = simpledialog.askstring("Email Notifications", "Enter receiver email:")

        if sender_email and email_password and receiver_email:
            self.monitor.config["email_notifications"] = True
            self.monitor.config["sender_email"] = sender_email
            self.monitor.config["email_password"] = email_password
            self.monitor.config["receiver_email"] = receiver_email

            try:
                with open(self.config_path, "w") as f:
                    json.dump(self.monitor.config, f, indent=2)
                messagebox.showinfo("Success", "Email notification settings updated")
            except Exception as e:
                messagebox.showerror("Error", f"Error saving config: {e}")

    def set_monitoring_interval(self):
        interval = simpledialog.askinteger("Monitoring Interval", "Enter monitoring interval in minutes:")
        if interval:
            self.monitor.config["monitoring_interval_minutes"] = interval
            try:
                with open(self.config_path, "w") as f:
                    json.dump(self.monitor.config, f, indent=2)
                messagebox.showinfo("Success", f"Monitoring interval set to {interval} minutes")
            except Exception as e:
                messagebox.showerror("Error", f"Error saving config: {e}")

    def run_test_scan(self):
        company = simpledialog.askstring("Test Scan", "Enter the name of the company to test scan:")
        if company:
            threading.Thread(target=self.monitor.monitor_company, args=(company,)).start()
            messagebox.showinfo("Test Scan", f"Running test scan for {company}...")

    def start_monitoring(self):
        if not self.monitoring_thread or not self.monitoring_thread.is_alive():
            self.monitoring_thread = threading.Thread(target=self.monitor.run_monitoring)
            self.monitoring_thread.start()
            self.start_monitoring_button.config(state=tk.DISABLED)
            self.stop_monitoring_button.config(state=tk.NORMAL)
            self.status_label.config(text="Status: Monitoring", foreground="green")
            messagebox.showinfo("Monitoring", "Monitoring started")

    def stop_monitoring(self):
        if self.monitoring_thread and self.monitoring_thread.is_alive():
            # This is a simplified way to stop the thread. In a real application, you should use a more robust method.
            self.monitor.stop_monitoring = True
            self.monitoring_thread.join()
            self.start_monitoring_button.config(state=tk.NORMAL)
            self.stop_monitoring_button.config(state=tk.DISABLED)
            self.status_label.config(text="Status: Not Monitoring", foreground="red")
            messagebox.showinfo("Monitoring", "Monitoring stopped")

if __name__ == "__main__":
    root = tk.Tk()
    style = ttk.Style()
    style.configure("TButton", padding=6, relief="flat", background="#0078d7", foreground="white")
    style.configure("TLabel", padding=6, background="#f0f0f0", foreground="#333333")
    style.configure("TFrame", padding=6, background="#f0f0f0")

    app = DarkWebMonitorUI(root)
    root.mainloop()
