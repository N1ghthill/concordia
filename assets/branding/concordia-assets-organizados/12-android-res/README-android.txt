Android launcher resources for Concordia

Copy folders into your Android app module resources:
app/src/main/res/

Included:
- mipmap-mdpi, mipmap-hdpi, mipmap-xhdpi, mipmap-xxhdpi, mipmap-xxxhdpi
- mipmap-anydpi-v26 (adaptive icon xml)
- drawable/ic_launcher_foreground.png
- drawable/ic_launcher_monochrome.png
- values/colors.xml

Notes:
- ic_launcher_round uses same artwork as ic_launcher.
- Adaptive icon references @color/ic_launcher_background and @drawable/ic_launcher_foreground.
- If your project already has colors.xml entries, merge only the ic_launcher_background color.
