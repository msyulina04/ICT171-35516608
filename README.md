# ICT171 Project
ICT171 – Physics Playground (Matter.js)

Student ID: 35516608
Project Type: Cloud-hosted interactive physics demo
Server: Azure VM (ICT171)
Domain: physics-simulator.click

# Overview
This project is a small interactive physics sandbox built with Matter.js.
It includes three modes:

Falling Balls – simple gravity simulation
Escape Ring – rotating rings that eject particles
Spring Web – particles connected by springs and deformed by user interaction

The goal is to explore “oddly satisfying” visual behaviour and experiment with simple interactive physics in a browser environment.

# Technology
HTML + CSS + JavaScript
Matter.js physics engine
Hosted on Azure Virtual Machine (B2ats v2)
Single-page design
Simple left-side UI panel for mode switching and parameters

# Deployment
VM created under “Azure for Students”.
Ubuntu Server 24.04.
Nginx installed and configured to serve /var/www/html/.
All project files copied to VM via SCP.
Firewall opened for ports 80/443.
Domain connected using Cloudns and an A-record pointing to the server

# Repository Structure
index.html
style.css
LICENSE
README.md
js/
main.js
mode_fall.js
mode_escape.js
mode_web.js

Old_versions folder for older versions of the website

# License
This project uses the MIT License.

# Development Timeline
Week 1: basic canvas with text description + testing physics engine
Week 2: UI panel + mode switching
Week 3: Escape Ring + Spring Web
Week 4: Deployment, domain, documentation, video
