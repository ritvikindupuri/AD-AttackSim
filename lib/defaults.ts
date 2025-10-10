export const DEFAULT_ENVIRONMENT = `
# Define the Active Directory Domain
domain: "adversary.local"
domain_controller:
  - id: "DC01"
    hostname: "ADV-DC01"
    ip: "10.10.1.5"
    os: "Windows Server 2019"
    services:
      - "Domain Controller"
      - "DNS"
      - "AD CS" # Active Directory Certificate Services is installed

# Define Organizational Units
ous:
  - name: "FINANCE"
    description: "Finance department users and computers."
  - name: "IT"
    description: "IT department users and computers."

# Define Network Servers
servers:
  - id: "WEB01"
    hostname: "FIN-WEB01"
    ip: "10.10.2.10"
    os: "Windows Server 2016"
    ou: "FINANCE"
    services:
      - "IIS"
  - id: "SQL01"
    hostname: "FIN-SQL01"
    ip: "10.10.2.15"
    os: "Windows Server 2019"
    ou: "FINANCE"
    services:
      - "MSSQL"

# Define Workstations
workstations:
  - id: "WS01"
    hostname: "FIN-WS01"
    ip: "10.10.10.101"
    os: "Windows 10 Enterprise"
    ou: "FINANCE"
  - id: "WS02"
    hostname: "IT-WS01"
    ip: "10.10.11.101"
    os: "Windows 11 Enterprise"
    ou: "IT"

# Define Network Security
security:
  firewall: true
  edr_solution: "CrowdStrike Falcon"
`.trim();
