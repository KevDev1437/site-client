# Script PowerShell pour uploader les images vers Supabase Storage
# Nécessite d'avoir créé le bucket 'products' et les dossiers manuellement

# Configuration
$SUPABASE_URL = "https://nhfmaxdkecahngnsczsn.supabase.co"
$SUPABASE_ANON_KEY = "VOTRE_CLE_ANON_SUPABASE"
$BUCKET_NAME = "products"

# Dossiers et images à uploader
$folders = @(
    "coffret-calligraphie",
    "carnet-croquis", 
    "fil-crochet-bio",
    "set-pinceaux-premium",
    "argile-poterie",
    "kit-peinture-aquarelle"
)

# Fonction pour uploader une image
function Upload-Image {
    param(
        [string]$FilePath,
        [string]$FolderName,
        [string]$FileName
    )
    
    $url = "$SUPABASE_URL/storage/v1/object/$BUCKET_NAME/$FolderName/$FileName"
    
    try {
        $headers = @{
            "Authorization" = "Bearer $SUPABASE_ANON_KEY"
            "Content-Type" = "image/jpeg"
        }
        
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -InFile $FilePath
        Write-Host "✅ Uploadé: $FolderName/$FileName" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Erreur upload $FolderName/$FileName : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Vérifier que les dossiers existent
Write-Host "📁 Vérification des dossiers..." -ForegroundColor Yellow
foreach ($folder in $folders) {
    Write-Host "📁 Dossier: $folder" -ForegroundColor Cyan
}

Write-Host "`n📤 Début de l'upload des images..." -ForegroundColor Yellow

# Uploader les images (remplacez les chemins par vos vrais chemins)
foreach ($folder in $folders) {
    $imagePath = "C:\Chemin\Vers\Vos\Images\$folder\image1.jpg"
    
    if (Test-Path $imagePath) {
        Upload-Image -FilePath $imagePath -FolderName $folder -FileName "image1.jpg"
    } else {
        Write-Host "⚠️ Image non trouvée: $imagePath" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Upload terminé !" -ForegroundColor Green
Write-Host "🔗 Vérifiez vos images dans Supabase Storage" -ForegroundColor Cyan
