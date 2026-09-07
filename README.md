# SANKET — AI-Powered Landslide Risk Intelligence System

SANKET is an AI-powered landslide monitoring and early-warning system designed to assess landslide risk in vulnerable mountainous regions using real-time sensor data, environmental parameters, and predictive analytics.

## Overview

Landslides can occur with little warning, causing significant damage to lives, infrastructure, and the environment.

SANKET addresses this challenge by combining IoT-based sensing, real-time monitoring, AI/ML-based risk assessment, and early-warning mechanisms into a unified platform.

The system continuously analyzes critical parameters such as:

* Rainfall and environmental conditions
* Temperature, humidity, and pressure
* Ground movement and tilt
* Vibration and terrain-related changes
* Soil and surrounding environmental conditions

Based on the collected data, SANKET classifies the risk level into:

**SAFE → WARNING → HIGH RISK → CRITICAL**

## Key Features

* **Real-Time Monitoring** — Monitor environmental and sensor parameters continuously.
* **AI-Based Risk Assessment** — Analyze multiple data sources to estimate landslide risk.
* **Risk Map** — Visualize vulnerable regions based on their current risk level.
* **Predictive Analysis** — Identify potential risk trends before critical conditions develop.
* **Historical Data** — Analyze previous sensor readings and environmental patterns.
* **Early Warning System** — Generate alerts when dangerous conditions are detected.
* **Centralized Dashboard** — Provide authorities with a unified view of system status and risk conditions.

## System Architecture

```text
Sensors
   ↓
IoT Gateway
   ↓
Real-Time Data Transmission
   ↓
Data Processing
   ↓
AI/ML Risk Analysis
   ↓
Risk Prediction
   ↓
Early Warning & Alerts
   ↓
Dashboard / Authorities
```

## Technology Stack

### Frontend

* React.js
* JavaScript
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI / ML

* Python
* Machine Learning
* Predictive Analytics

### IoT & Sensors

* MPU6050
* BME280
* HC-SR04
* Soil and Environmental Sensors
* IoT / LoRa / Wi-Fi / GSM

### Deployment & Tools

* Git
* GitHub
* Vercel

## Risk Classification

| Risk Level | Status    | Description                                 |
| ---------- | --------- | ------------------------------------------- |
| Safe       | Normal    | No significant risk detected                |
| Warning    | Elevated  | Environmental conditions require monitoring |
| High Risk  | Dangerous | Significant landslide indicators detected   |
| Critical   | Emergency | Immediate warning and response required     |

## Objective

The primary objective of SANKET is to move landslide management from reactive response to proactive prediction, enabling authorities and communities to identify dangerous conditions earlier and take appropriate preventive action.

## Future Scope

* Integration with satellite and GIS data
* Advanced deep-learning prediction models
* Wider LoRa-based sensor deployment
* Automated SMS and emergency notifications
* Integration with government disaster-management systems
* Edge AI for low-connectivity regions
* Expansion to large-scale regional risk monitoring

## Project

Developed as a Smart India Hackathon 2026 project focused on AI-powered landslide risk monitoring and early warning.

---

**SANKET — Predict. Warn. Protect.**
