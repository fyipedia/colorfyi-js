Output demo.gif
Set FontSize 20
Set Width 1000
Set Height 580
Set Shell "zsh"
Set Theme "Catppuccin Mocha"
Set TypingSpeed 30ms
Set Padding 24

Type "node"
Enter
Sleep 1s

Type "const { getColorInfo, contrastRatio, harmonies } = await import('@fyipedia/colorfyi')"
Enter
Sleep 1.5s

Type "getColorInfo('FF6B35').rgb"
Enter
Sleep 2s

Type "getColorInfo('FF6B35').hsl"
Enter
Sleep 2s

Type "contrastRatio('FF6B35', '000000')"
Enter
Sleep 2.5s

Type "harmonies('FF6B35').complementary"
Enter
Sleep 2s

Type ".exit"
Enter
Sleep 1s
