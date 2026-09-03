param(
  [Parameter(Mandatory = $true)]
  [string]$Source
)

$ErrorActionPreference = "Stop"
$content = [System.IO.File]::ReadAllText($Source)
$documents = [regex]::Matches($content, '<!DOCTYPE html>[\s\S]*?</html>')
$names = @('index.html', 'learn.html', 'mutual-funds.html', 'financial-freedom.html')
$titles = @(
  'The MoneyGoal - Build Your Financial Freedom',
  'Learn Personal Finance | The MoneyGoal',
  'Mutual Funds for Beginners | The MoneyGoal',
  'Financial Freedom Planner | The MoneyGoal'
)

if ($documents.Count -ne $names.Count) {
  throw "Expected $($names.Count) Stitch documents, found $($documents.Count)."
}

for ($i = 0; $i -lt $documents.Count; $i++) {
  $page = $documents[$i].Value
  if ($page -match '<title>[\s\S]*?</title>') {
    $page = [regex]::Replace($page, '<title>[\s\S]*?</title>', "<title>$($titles[$i])</title>", 1)
  } else {
    $page = $page.Replace('<head>', "<head><title>$($titles[$i])</title>")
  }
  # Calculators are intentionally not part of the published navigation.
  $page = [regex]::Replace($page, '<a\b(?=[^>]*data-path="calculators")[^>]*>[\s\S]*?</a>', '')
  $page = [regex]::Replace($page, '<div class="flex flex-col gap-space-xs"><h4[^>]*>Tools &amp; Calculators</h4>[\s\S]*?</div>', '')
  $page = $page.Replace('visual calculators', 'visual examples')
  $page = $page.Replace('Content, calculators, and assessments', 'Content, learning tools, and assessments')
  $page = $page.Replace('in our dedicated calculator.', 'in the guided example above.')

  # The Learn experience uses iconography rather than editorial photography.
  if ($i -eq 1) {
    $page = [regex]::Replace($page, '<img\b(?=[^>]*data-alt=)[^>]*>', '<span class="material-symbols-outlined w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center text-secondary text-[28px] shrink-0">auto_stories</span>')
    $page = [regex]::Replace($page, '<img\b(?=[^>]*alt="Profile")[^>]*>', '<span class="material-symbols-outlined text-on-surface-variant">account_circle</span>')
  }

  # Use the compact brand mark supplied in the header reference and remove the
  # decorative profile/avatar that appeared beside the Start Learning action.
  $brandMark = '<span class="moneygoal-brand-mark" aria-hidden="true"><svg viewBox="0 0 36 36" role="img"><path class="moneygoal-brand-axis" d="M9 9v18h18"/><path class="moneygoal-brand-bars" d="M13 23v-5m5 5V12m5 11v-8"/><path class="moneygoal-brand-line" d="m11 21 6-5 4 3 7-8"/><path class="moneygoal-brand-arrow" d="M24 11h4v4"/></svg></span>'
  $page = [regex]::Replace($page, '<img\b(?=[^>]*alt="The MoneyGoal Brand Logo")[^>]*>', $brandMark)
  $page = $page.Replace('>The MoneyGoal</span>', '>The Money<span class="text-secondary">Goal</span></span>')
  $page = $page.Replace(' tracking-tight hidden sm:inline', ' tracking-tight moneygoal-brand-text')
  $page = [regex]::Replace($page, '<div class="flex items-center pl-space-2xs"><a\b[^>]*data-path="profile"[^>]*>[\s\S]*?</a></div>', '')
  $page = $page.Replace('</head>', '<link rel="stylesheet" href="/assets/site.css"></head>')
  $page = $page.Replace('</body>', '<script src="/assets/config.js"></script><script src="/assets/site.js"></script></body>')
  [System.IO.File]::WriteAllText((Join-Path (Get-Location) $names[$i]), $page, [System.Text.UTF8Encoding]::new($false))
}

Write-Output "Imported $($documents.Count) Stitch pages."
