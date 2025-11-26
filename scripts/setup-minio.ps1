# MinIO Bucket Setup Script
# Run this script to create and configure the bucket for your media files

# MinIO Configuration
$MINIO_ENDPOINT = "https://minio-f4cgw800cgssc0wo48gss8g0.51.38.234.113.sslip.io"
$MINIO_ACCESS_KEY = "fnfm8vI8ZxWAkAvD"
$MINIO_SECRET_KEY = "R0bRw2XU9ag8QpXugoUKGb1BcdSwu7ek"
$BUCKET_NAME = "mdiomed-media"

Write-Host "MinIO Bucket Setup" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""

# Check if mc (MinIO Client) is installed
if (!(Get-Command mc -ErrorAction SilentlyContinue)) {
    Write-Host "MinIO Client (mc) is not installed." -ForegroundColor Yellow
    Write-Host "Please install it from: https://min.io/docs/minio/linux/reference/minio-mc.html" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use the MinIO Console at:" -ForegroundColor Yellow
    Write-Host "https://console-f4cgw800cgssc0wo48gss8g0.51.38.234.113.sslip.io" -ForegroundColor Green
    Write-Host ""
    Write-Host "Manual Steps:" -ForegroundColor Cyan
    Write-Host "1. Login with username: fnfm8vI8ZxWAkAvD" -ForegroundColor White
    Write-Host "2. Create bucket named: mdiomed-media" -ForegroundColor White
    Write-Host "3. Set Access Policy to 'public' or 'download'" -ForegroundColor White
    exit
}

Write-Host "Setting up MinIO alias..." -ForegroundColor Green
mc alias set mdiomed $MINIO_ENDPOINT $MINIO_ACCESS_KEY $MINIO_SECRET_KEY

Write-Host "Creating bucket: $BUCKET_NAME..." -ForegroundColor Green
mc mb mdiomed/$BUCKET_NAME --ignore-existing

Write-Host "Setting anonymous download policy..." -ForegroundColor Green
mc anonymous set download mdiomed/$BUCKET_NAME

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Bucket Information:" -ForegroundColor Cyan
mc ls mdiomed/$BUCKET_NAME
Write-Host ""
Write-Host "Public URL: $MINIO_ENDPOINT/$BUCKET_NAME" -ForegroundColor Yellow
