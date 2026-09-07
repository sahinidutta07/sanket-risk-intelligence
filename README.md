# sanket risk intelligence

SANKET

AI-Powered Landslide Early Warning & Risk Intelligence System

SANKET is an AI + IoT based disaster-management platform that monitors landslide-prone regions using real-time environmental and ground sensors, analyzes multiple risk factors, predicts landslide probability and provides actionable early warnings.

The goal is to create a website that would look credible in front of:

 Smart India Hackathon judges

 Government officials

 Disaster-management authorities

 Technical evaluators

 Researchers

 Potential deployment partners

⚠️ MOST IMPORTANT DESIGN INSTRUCTION

DO NOT completely redesign the existing concept.

The current design direction is already established:

Dark navy command-center dashboard + blue navigation + satellite terrain maps + green/yellow/orange/red risk visualization + compact data cards.

Keep this identity.

However, make the interface significantly more polished, intelligent and realistic.

Think:

“Indian disaster-management control room meets modern geospatial intelligence platform.”

NOT:

“Generic AI SaaS dashboard.”

NOT:

“Cyberpunk hacker dashboard.”

NOT:

“Dribbble concept with unnecessary animations.”

The website should feel like something that could realistically be deployed by a government disaster-management department.

🎯 DESIGN GOAL

The final interface should communicate these five qualities within seconds:

1. REAL-TIME

The system is continuously receiving sensor information.

2. INTELLIGENT

AI/ML converts raw sensor readings into risk predictions.

3. GEO-SPATIAL

Risk is visualized geographically.

4. ACTIONABLE

The system doesn't just show data — it tells authorities what needs attention.

5. TRUSTWORTHY

Every risk prediction should have understandable contributing factors.

🧭 PRIMARY NAVIGATION

There should be ONLY SIX primary pages:

Dashboard

Live Monitoring

Risk Map

Sensor Data

Predictions

Historical Data

Do NOT create separate pages for:

 Alerts

 Settings

 User Management

Alerts should instead be integrated into Dashboard and Live Monitoring.

🎨 VISUAL LANGUAGE

Use a sophisticated dark command-center interface.

Background

Very dark navy:

#050B12

Secondary background:

#08131C

Cards:

#0D1A23

Borders:

subtle blue-gray.

Primary accent:

professional electric blue.

Risk colors:

🟢 Low
🟡 Moderate
🟠 High
🔴 Very High
🔴 Critical

Do not overuse accent colors.

Color should communicate meaning, not decoration.

✍️ TYPOGRAPHY

This is extremely important.

Avoid generic AI-dashboard fonts.

Use:

Primary

IBM Plex Sans

Technical data

IBM Plex Mono

Use IBM Plex Mono for:

 Sensor IDs

 Risk scores

 Coordinates

 Timestamps

 Numerical measurements

 System logs

Typography hierarchy:

Page title → 28–32px

Section title → 18–22px

Card title → 14–16px

Major numerical value → 26–32px

Supporting information → 12–14px

Make the typography feel like a professional technical monitoring system.

🏔️ SANKET BRANDING

Create a clean SANKET identity using the existing mountain concept.

Logo concept:

Stylized Himalayan mountain inside a circular boundary.

Keep it monochrome/white on the dark background.

Under the logo:

SANKET

Small subtitle:

LANDSLIDE INTELLIGENCE SYSTEM

Keep branding minimal and institutional.

🖥️ GLOBAL HEADER

Every page should have a consistent top header.

Left:

☰

Landslide Early Warning System

Under or beside the title, show the current operational state:

● SYSTEM OPERATIONAL

Right:

 Notification icon

 Admin profile

ADMIN

 small online indicator

The live status indicator should have a very subtle pulse.

⭐ ADD A PROFESSIONAL “SYSTEM LIVE” FEEL

The interface should subtly communicate that this is a live system.

Include small indicators such as:

● LIVE

LAST SYNC 10:24:30 AM

38/40 SENSORS ONLINE

DATA STREAM ACTIVE

Do not make them flashy.

PAGE 1 — DASHBOARD

This should be the command center.

The first screen should immediately answer:

“What is happening right now?”

TOP COMMAND BAR

Show:

SYSTEM STATUS

● ALL SYSTEMS OPERATIONAL

Last synchronized:

10:24:30 AM

Data sources:

40 Sensors | Weather | Terrain | Historical Records

KPI ROW

Create five high-quality KPI cards.

OVERALL RISK

HIGH RISK

78 / 100

Circular risk meter.

Below:

↑ 8% from previous hour

AFFECTED AREAS

12

HIGH RISK

Small trend indicator.

ACTIVE ALERTS

5

2 CRITICAL

MONITORED AREAS

48

Across Darjeeling Region

SENSOR NETWORK

36 / 40

90% ONLINE

🚨 CRITICAL SITUATION BANNER

If any location reaches critical risk, show a compact but highly visible alert strip:

🔴 CRITICAL RISK DETECTED

Lebong, Darjeeling
Risk Score: 89%
Primary Factors: Heavy Rainfall + High Soil Moisture
Immediate assessment recommended

Buttons:

View Risk Area →

View Prediction →

This makes the dashboard feel action-oriented, rather than just analytical.

🗺️ MAIN RISK MAP

The map should be the visual centerpiece.

Title:

LIVE LANDSLIDE RISK MAP

Badge:

● LIVE

Use realistic terrain/satellite imagery.

Overlay risk zones.

Risk visualization:

Green → Low
Yellow → Moderate
Orange → High
Red → Very High

Add:

 Location markers

 Sensor markers

 Risk hotspots

 Map controls

 Zoom

 Layer toggle

 Search

🧠 ADD “WHY IS THIS AREA AT RISK?”

This is one of the most important improvements.

When a location is selected, show an intelligent explanation card:

LEBONG, DARJEELING

CRITICAL

Risk Score:

89%

Then:

Risk Drivers

🌧 Rainfall
112 mm
High impact

💧 Soil Moisture
88%
High impact

⛰ Slope
34°
High impact

📡 Ground Movement
2.4 mm/hr
Moderate impact

Then:

AI Assessment

High probability of slope instability due to sustained rainfall, elevated soil moisture and steep terrain.

Button:

View Full Prediction →

This is MUCH more impressive for judges than simply displaying "89%".

🚨 RECENT ALERTS

Show alerts in chronological order.

Each alert should contain:

Severity

Location

Trigger

Time

Status

Example:

CRITICAL

Lebong, Darjeeling

Heavy rainfall + ground movement

10:30 AM

HIGH

Mirik

Soil moisture threshold exceeded

10:18 AM

Use visual severity hierarchy.

📊 SENSOR SNAPSHOT

Create four compact monitoring panels:

Rainfall

42.6 mm

↑ 12%

Soil Moisture

85%

↑ 8%

Ground Movement

2.4 mm/hr

↑ 10%

Ground Temperature

23.7°C

↑ 2%

Each includes a tiny trend graph.

PAGE 2 — LIVE MONITORING

This page should feel like a real-time operations console.

Title:

LIVE MONITORING

Subtitle:

Real-time environmental and ground-condition monitoring

LIVE STATUS STRIP

Show:

● LIVE DATA STREAM

36/40 SENSORS ONLINE

Last update: 10:24:30 AM

Data latency: 1.8 sec

CURRENT CONDITIONS

Four large cards:

RISK LEVEL

HIGH

77/100

RAINFALL

62.4 mm

Moderate

SOIL MOISTURE

38.7%

Normal

ELEVATION

2,245 m

Above Sea Level

LIVE MAP

Large interactive map.

Add a subtle timestamp:

LIVE — Updated 10:24:30 AM

Sensor markers should indicate status:

🟢 Online

🟡 Warning

🔴 Critical

⚫ Offline

Clicking a sensor should open:

SENSOR SN-101

Location:

Darjeeling

Type:

Rainfall

Current:

86 mm

Status:

Online

Last update:

10:24:27 AM

RECENT ALERT STREAM

Create an alert timeline.

Each alert should visually communicate:

WHAT → WHERE → WHEN → SEVERITY

This should look more like an operations console than a normal notification list.

WEATHER OVERVIEW

Include:

Temperature

Rainfall

Humidity

Wind

Visibility

Pressure

Forecast.

PAGE 3 — RISK MAP

This is the geospatial intelligence page.

Make the map extremely prominent.

Title:

LANDSLIDE RISK MAP

Subtitle:

AI-generated spatial risk assessment

MAP

Use Darjeeling/Kalimpong region.

Locations:

 Darjeeling

 Siliguri

 Mirik

 Kurseong

 Kalimpong

 Lebong

 Sukhiapokhri

Risk heatmap.

ADD MAP LAYERS

Create a layer selector:

Layers

☑ Risk Zones

☑ Sensor Network

☑ Rainfall

☐ Soil Moisture

☐ Ground Movement

☐ Terrain / Slope

This is a strong feature because it makes the platform feel like actual geospatial software.

SELECTED AREA PANEL

When clicking a region:

LEBONG, DARJEELING

🔴 CRITICAL

Risk:

89%

CONTRIBUTING FACTORS

Rainfall — 112 mm
Soil Moisture — 88%
Slope — 34°
Ground Movement — 2.4 mm/hr

AI CONFIDENCE

91%

RECOMMENDED ACTION

Increase monitoring frequency and initiate local authority verification.

Button:

View Detailed Prediction →

PAGE 4 — SENSOR DATA

This page should demonstrate the IoT layer.

Title:

SENSOR DATA

Subtitle:

Real-time telemetry from distributed monitoring stations

Button:

SIMULATE SENSOR DATA

SENSOR NETWORK STATUS

Show:

38 / 40 ONLINE

Then:

Online — 38

Warning — 2

Offline — 2

Maintenance — 1

Use a clean donut visualization.

SENSOR CARDS

Six cards:

Rainfall
Soil Moisture
Ground Movement
Temperature
Humidity
Tilt

Each includes:

Current value

Unit

Change

Status

Mini chart

Sensor ID

SENSOR DETAIL INTERACTION

Clicking a sensor opens a detailed panel.

Example:

SN-103

Ground Movement Sensor

Location:

Kalimpong

Current:

2.4 mm/hr

Status:

🟢 Online

Battery:

87%

Signal:

Strong

Last update:

10:24:28 AM

RECENT READINGS TABLE

Include:

Sensor ID

Location

Type

Value

Status

Timestamp

PAGE 5 — PREDICTIONS

This should be the AI/ML showcase page.

Title:

RISK PREDICTIONS

Subtitle:

AI-based landslide probability and risk assessment

PREDICTION TABLE

Columns:

Area

Risk Score

Risk Level

Probability

Confidence

Key Factors

Updated

Example:

Lebong

86%

CRITICAL

89%

91% confidence

Heavy Rainfall
High Soil Moisture
Steep Slope

AI EXPLAINABILITY

This is VERY important.

Create a section:

WHY THIS PREDICTION?

For selected location show a horizontal feature contribution chart:

Rainfall

██████████████ 35%

Soil Moisture

██████████ 26%

Slope

███████ 18%

Land Cover

████ 12%

Ground Movement

███ 9%

This demonstrates that the prediction isn't simply a black box.

MODEL PERFORMANCE

Show:

Accuracy

92.4%

Precision

90.1%

Recall

83.2%

F1 Score

91.6%

Model:

Random Forest

Also show:

Training Data → Feature Engineering → Random Forest → Risk Probability

Use a small clean pipeline diagram.

PREDICTION CONFIDENCE

Add a confidence indicator.

Example:

MODEL CONFIDENCE

91%

High Confidence

This is useful because it distinguishes risk score from model confidence.

PAGE 6 — HISTORICAL DATA

This page demonstrates that SANKET isn't only reactive — it learns from historical conditions.

Title:

HISTORICAL DATA

Subtitle:

Historical environmental conditions and landslide events

FILTER BAR

District

Parameter

Date range

Risk level

Apply

HISTORICAL RAINFALL

Large interactive chart.

Allow:

 Hover

 Date selection

 Zoom

 Comparison

SUMMARY

Total Rainfall

642 mm

Average

91.7 mm

Peak

103 mm/h

Threshold Exceeded

32 mm — 19 MAY

HISTORICAL LANDSLIDE EVENTS

Professional table.

Date

Location

Magnitude

Rainfall

Risk Score

Impact

Example:

12 May 2026
Lebong, Darjeeling
High
103 mm/h
87%
Road Blocked

CORRELATION INSIGHT

Add a small analytical card:

HISTORICAL INSIGHT

Landslide risk increased significantly during periods of sustained rainfall combined with elevated soil moisture.

This makes the historical page analytical instead of just a database table.

🔄 SIMULATION MODE

This can become one of your best demo features.

Create a global:

SIMULATION MODE

button.

When activated:

SIMULATE HEAVY RAINFALL EVENT

The system should simulate:

Rainfall ↑

↓

Soil Moisture ↑

↓

Ground Movement ↑

↓

Risk Score ↑

↓

Risk Level changes

↓

Alert generated

↓

Affected region highlighted on map

↓

Prediction updated

This should happen smoothly in the UI.

For example:

BEFORE

Risk:

52 — MODERATE

Then simulation begins.

AFTER

Rainfall:

62 → 112 mm

Soil Moisture:

65% → 88%

Ground Movement:

1.2 → 2.4 mm/hr

Risk:

52 → 89

Status:

🟡 MODERATE

↓

🔴 CRITICAL

Then automatically display:

CRITICAL RISK DETECTED — LEBONG, DARJEELING

This gives judges an actual story to watch during the demo.

🧠 RISK ENGINE

Create a consistent conceptual risk calculation.

Use multiple factors:

Rainfall

Soil Moisture

Slope

Ground Movement

Land Cover

The frontend can use a deterministic simulation formula for demonstration.

Do NOT randomly change numbers.

Risk should increase logically when dangerous factors increase.

🎯 ACTION-ORIENTED DESIGN

Whenever risk becomes HIGH or CRITICAL, the UI should not simply say:

“Risk = 89%”

It should communicate:

WHAT HAPPENED?

Heavy rainfall detected.

WHERE?

Lebong, Darjeeling.

WHY?

High rainfall + high soil moisture + steep slope.

WHAT DOES AI PREDICT?

89% probability.

WHAT SHOULD AUTHORITIES DO?

Increase monitoring / verify area / initiate warning protocol.

This is the philosophy throughout the entire application.

📡 SENSOR → AI → WARNING VISUALIZATION

Add a subtle system-flow component somewhere appropriate:

DATA PIPELINE

Sensors

↓

IoT Gateway

↓

Real-Time Data

↓

AI Risk Engine

↓

Risk Prediction

↓

Early Warning

The flow should be visually elegant and not oversized.

This immediately communicates the technical architecture to judges.

✨ MICRO-INTERACTIONS

Use premium but restrained animations.

Cards

Small hover elevation.

Charts

Smooth drawing animation.

Risk score

Animated number transition.

Live indicator

Very subtle pulse.

Alerts

Critical alert can have a subtle red edge pulse.

Map

Smooth zoom and selection.

Navigation

Smooth active-state transition.

Buttons

Small 150–250ms transitions.

Do NOT use:

❌ excessive particles
❌ neon glow
❌ huge gradients
❌ spinning dashboards
❌ excessive glassmorphism
❌ bouncing cards
❌ flashy page transitions

📱 RESPONSIVE DESIGN

Desktop is the primary target.

Desktop:

Sidebar + full command center.

Tablet:

Collapsible sidebar.

Mobile:

Drawer navigation.

Cards:

Responsive grid.

Tables:

Horizontal scrolling.

Map:

Fully usable.

🧩 COMPONENT ARCHITECTURE

Create reusable components:

Sidebar
TopHeader
SystemStatus
KpiCard
RiskBadge
RiskMeter
AlertCard
AlertTimeline
SensorCard
SensorStatus
SensorTable
RiskMap
MapLegend
MapLayerControl
AreaDetails
PredictionTable
PredictionExplanation
ModelPerformance
WeatherCard
RiskTrendChart
HistoricalEventTable
QuickActions
SimulationPanel

Keep the application modular.

⚙️ TECHNOLOGY

Use:

React + TypeScript

Tailwind CSS

Lucide React

Recharts

Interactive map library

Use clean component architecture.

Prepare the frontend so that real APIs can later replace mock data.

🔥 FINAL QUALITY BAR

Before considering the UI complete, ask:

Would this look credible if displayed on a large screen inside a disaster-management control room?

If the answer is no, refine it.

The application should have:

Professional typography

Strong visual hierarchy

Realistic data

Geospatial visualization

IoT monitoring

AI explainability

Actionable alerts

Historical analysis

Simulation

🚨 FINAL INSTRUCTION TO LOVABLE

Do not turn SANKET into a generic dashboard template.

Preserve the dark command-center identity.

The design should be approximately:

70% familiar operational dashboard

20% geospatial intelligence platform

10% premium visual refinement

The goal is not to impress judges with decoration.

The goal is to make judges think:

“This team has actually thought about how a real disaster-management system would work.”

Prioritize clarity, credibility, explainability and operational usefulness over visual gimmicks.

Make SANKET feel like a real product that could evolve from an SIH prototype into a deployable disaster-management platform.

🔥 And bro, THIS is what I would specifically add for your SIH demo

Your existing screens are already visually good. The thing that can make you stand out isn't another prettier card.

It's this flow:

🌧️ SIMULATE HEAVY RAINFALL

→ Rainfall rises
→ Soil moisture rises
→ Ground movement changes
→ AI Risk Engine recalculates
→ Risk Map turns red
→ Risk Score goes from 52 → 89
→ Prediction becomes CRITICAL
→ Alert appears
→ System recommends an action

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sanket-risk-intelligence.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9d7d4ccd-07af-4b33-80bc-ce5c426d422f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
