---
title: Calibrating 3D printer with RRF
date: 2023-07-01
tags:
    - rrf
    - 3d printing
category: tech
---

# Calibrating 3D printer with RRF

I really enjoy the fact that RRF boards use gcode for calibration, although I found a few specific issues with calibration.

If the PID autotune command (e.g. `M303 E0 S200 C8`) returns "No heater has been tuned since startup," it means that `E0` is an invalid reference to the heater element. Try using `H0` and `H1` instead of `E-1` and `E0`.

## Tools suggestions

The best tool that I know for calibration is [Teaching Tech 3D Printer Calibration](https://teachingtechyt.github.io/calibration.html).

For linear advance calibration, it references Marlin's generator. However, if you use RRF, I recommend using this [forked generator](https://www.advanced3dprinting.com/linear-advance-tool-rrf/) of test gcode.