# Darik loan prototype

Source: Figma Darik, section 5765:188743; starting screen 5765:190283.
The Figma file was inspected and exported without changing source nodes.

The viewer preserves original PNG screen pixels, source hotspot positions, navigation/back actions, and two-second automatic transitions. The section contains 37 full-width screens: 31 are reachable from its starting point and six have no incoming connection in the original flow. Nine connected support screens are also included. The viewer's screen selector can open all 46 exported screens without inventing links inside the design.

Shop favorite state changes use the original Figma SVG states. Support loading dots and Smart Animate transitions are reconstructed in browser code using exported original layers, timing, and easing. This is a presentation prototype; it does not perform actual credit, identity, SMS, or payment operations.

Validation: all 46 screen PNG dimensions and all navigation destinations checked; 40 support-animation layer exports included. The runtime harness exercises 106 click hotspots, six automatic transitions, the full 24-step main route, back, and restart. Native browser automation was unavailable, so complete rendered browser QA is not claimed.

Hosting: an initial Sites project is retained in .openai/hosting.json but remains unpublished because its Git hosting endpoint timed out. Publication uses the separate public repository parisanasri86-sudo/darik-loan-prototype through the authorized Composio connection.

Local preview: dist/index.html. All image data is embedded in dist/assets.js for reliable public deployment. Original exports remain in dist/assets.
