import { NextResponse } from 'next/server'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  const { requireAdmin } = await import('@/lib/admin-auth')
  const guard = await requireAdmin()
  if (guard) return guard
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'فایلی انتخاب نشده' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'phone-shop' },
      (error, result) => {
        if (error) reject(error)
        else if (result) resolve(result)
        else reject(new Error('آپلود تصویر ناموفق بود'))
      }
    ).end(buffer)
  })

  return NextResponse.json({ url: result.secure_url })
}
