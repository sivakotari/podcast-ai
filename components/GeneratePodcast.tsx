import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {v4 as uuidv4} from 'uuid'
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from './ui/use-toast'


const useGeneratePodcast = ({
  setAudioStorageId,
  setAudio,
  voiceType,
  audio,
  voicePrompt,
  setVoicePrompt,
  setAudioDuration }: GeneratePodcastProps) => {

  // generate podcast Logic
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const getAudioUrl = useMutation(api.podcasts.getUrl)
  const getPodcastAudio = useAction(api.openai.generateAudioAction)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const {startUpload} = useUploadFiles(generateUploadUrl)
  const { toast } = useToast()

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');

    
    try {
      if (!voiceType) {
        toast({
          title: 'Please select AI Voice!'
        })
        return;
      }
      if(!voicePrompt) {
        toast({
          title: 'Please provide Prompt!'
        })
        return;
      }

      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt
      })
      const blob = new Blob([response], {type: 'audio/mpeg'})
      const fileName = `podcastai-${uuidv4()}.mp3`
      const file = new File([blob], fileName, {type: 'audio/mpeg'})

      const uploaded = await startUpload([file])
      const storageId = (uploaded[0].response as any).storageId
      const audioUrl = await getAudioUrl({ storageId})

      setAudioStorageId(storageId)
      setAudio(audioUrl!)
      toast({
        title: "Podcast generated successfully!",
      })
    } catch (error) {
      console.error('Error generating podcast', error)
      toast({
        title: "Uh oh! Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false);
    }
  }

  return {
    isGenerating,
    generatePodcast
  }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {

  const { isGenerating, generatePodcast } = useGeneratePodcast(props)
  
  return (
    <div>
      <div className='flex flex-col gap-2.5'>
        <Label className='text-16 font-bold text-white-1'>AI Prompt to generate Podcast</Label>
        <Textarea 
          className='input-class font-light focus-visible:ring-offset-orange-1' 
          placeholder='Provide text to generate audio'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
          />
      </div>
      <div className='mt-5 w-full max-w-[200px]'>
        <Button
          type="submit"
          className="text-16 bg-orange-1 font-bold py-4 text-white-1"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              Generating
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </div>

      {props.audio && (
        <audio 
          src={props.audio}
          controls
          autoPlay
          className='mt-5'
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  )
}

export default GeneratePodcast