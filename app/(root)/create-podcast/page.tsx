"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Loader } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "@/components/ui/use-toast"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  podcastTitle: z.string().min(2, {
    message: "Podcast Title must be at least 2 characters.",
  }),
  podcastDescription: z.string().min(2, {
    message: "Podcast Description must be at least 2 characters.",
  }),
})

const voiceCategories = ['echo', 'alloy', 'fable', 'shimmer', 'onyx', 'nova'];

const CreatePodcast = () => {
  const router = useRouter()
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageStorageId, setImageStorageId] = useState<Id<'_storage'> | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [audioStorageId, setAudioStorageId] = useState<Id<'_storage'> | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [voicePrompt, setVoicePrompt] = useState<string>('');
  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const createPodcast = useMutation(api.podcasts.createPodcast)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription:""
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    debugger
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(data)
    try {
      setIsSubmitting(true)

      if(!audioUrl || !imageUrl || !voiceType) {
        toast({
          title: "Please generate Audio and Image!",
          variant: "destructive",
        })
        throw new Error('Please generate Audio and Image!')
      }

      const podcast = await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        voicePrompt,
        imagePrompt,
        voiceType,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      })
      toast({title: 'Podcast created!'})
      router.push('/')
    } catch (error) {
      console.error('Error submitting podcast', error)
      toast({
        title: "Error submitting podcast!",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <section className="mt-10 flex- flex-col">
      <h1 className='text-20 font-bold text-white-1'>Create Podcast</h1>
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex flex-col w-full">
          <div className="flex flex-col border-b border-black-5 gap-[30px] pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Podcast Title</FormLabel>
                  <FormControl>
                    <Input className="input-class focus-visible:ring-offset-orange-1" placeholder="The Stories of Mahabharatam" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">Select AI Voice</Label>
              <Select onValueChange={(voice) => setVoiceType(voice)}>
                <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1')}>
                  <SelectValue placeholder="Select AI voice" className=" placeholder:text-gray-1" />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-offset-orange-1">
                  {voiceCategories.map((voice) => 
                    <SelectItem className=" capitalize focus:bg-orange-1" key={voice} value={voice}>{voice}</SelectItem>
                  )}
                </SelectContent>
                {voiceType && (
                  <audio 
                    src={`/${voiceType}.mp3`}
                    className="hidden"
                    autoPlay
                  />
                )}
              </Select>
            </div>

            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                  <FormControl>
                    <Textarea className="input-class focus-visible:ring-offset-orange-1" placeholder="Write a short podcast description" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePodcast 
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceType={voiceType}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />
            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId= {setImageStorageId}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />
            <div className="mt-10 w-full">
              <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1">
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin mr-2" />
                    Submitting
                  </>
                ) : (
                  'Submit & Publish Podcast'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default CreatePodcast;