import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Camera, Video, Download, Calendar } from "lucide-react"
import Link from "next/link"
import { CctvUploadForm } from "@/components/cctv-upload-form"

export default async function CctvPage() {
  const supabase = await createClient()

  // Fetch CCTV footage records
  const { data: footage } = await supabase.from("cctv_footage").select("*").order("timestamp", { ascending: false })

  // Calculate total storage
  const totalStorage = footage?.reduce((sum, f) => sum + (f.file_size_mb || 0), 0) || 0
  const totalDuration = footage?.reduce((sum, f) => sum + (f.duration_seconds || 0), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">CCTV Footage</h1>
          <p className="text-muted-foreground">View and manage camera recordings</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Storage Overview</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{footage?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Video files stored</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(totalDuration / 60)} min</div>
                <p className="text-xs text-muted-foreground">{totalDuration} seconds total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStorage.toFixed(2)} MB</div>
                <p className="text-xs text-muted-foreground">Total file size</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Upload Form */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Upload New Footage</h2>
          <Card>
            <CardHeader>
              <CardTitle>Add CCTV Recording</CardTitle>
              <CardDescription>Upload new video footage to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <CctvUploadForm />
            </CardContent>
          </Card>
        </section>

        {/* Footage Gallery */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Recorded Footage</h2>
          {footage && footage.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {footage.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url || "/placeholder.svg"}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
                      {video.duration_seconds
                        ? `${Math.floor(video.duration_seconds / 60)}:${String(video.duration_seconds % 60).padStart(2, "0")}`
                        : "N/A"}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base">{new Date(video.timestamp).toLocaleDateString()}</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(video.timestamp).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File Size:</span>
                        <span className="font-mono">{video.file_size_mb?.toFixed(2) || "N/A"} MB</span>
                      </div>
                      {video.notes && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">{video.notes}</p>
                        </div>
                      )}
                      <div className="pt-2">
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
                        >
                          <Video className="h-3 w-3" />
                          View Video
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No footage available. Upload your first recording above.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  )
}
