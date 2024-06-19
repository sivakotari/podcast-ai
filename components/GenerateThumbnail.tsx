import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { GenerateThumbnailProps } from '@/types'
import { Input } from './ui/input'
import Image from 'next/image'
import { toast } from './ui/use-toast'
import { useAction, useMutation } from 'convex/react'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid'

const GenerateThumbnail = (props: GenerateThumbnailProps) => {
  const imageRef = useRef<HTMLInputElement>(null)
  const [isAiThumbnail, setIsAiThumbnail] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getImageUrl = useMutation(api.podcasts.getUrl)
  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction)

  const handleImage = async(blob: Blob, fileName: string) => {
    setIsImageLoading(true)
    props.setImage('')

    try {
      const file = new File([blob], fileName, { type: 'image/png' })
      const uploaded = await startUpload([file])
      const storageId = (uploaded[0].response as any).storageId
      const imageUrl = await getImageUrl({ storageId })

      props.setImageStorageId(storageId)
      props.setImage(imageUrl!)
      toast({
        title: "Thumbnail generated successfully!",
      })
    } catch (error) {
      console.error('Error generating podcast', error)
      toast({
        title: "Error generating image!",
        variant: "destructive",
      })
    } finally {
      setIsImageLoading(false)
    }
  }
  const generateImage = async() => {
    try {
      if (!props.imagePrompt) {
        toast({
          title: 'Please provide Thumbnail Prompt!'
        })
        return;
      }
      const response = await handleGenerateThumbnail({prompt: props.imagePrompt})
      const blob = new Blob([response], { type: 'image/png' })
      handleImage(blob, `podcastai-${uuidv4()}`)
    } catch (error) {
      console.error('Error generating thumbnail', error)
      toast({
        title: "Error generating thumbnail!",
        variant: "destructive",
      })
    }
  }
  const uploadImage = async(e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    try {
      const files = e.target.files
      if(!files) return
      const file = files[0]
      const blob = await file.arrayBuffer().then((arrbuffer) => new Blob([arrbuffer]))
      handleImage(blob, file.name)
      
    } catch (error) {
      console.error('Error generating podcast', error)
      toast({
        title: "Error Uploading image!",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className='generate_thumbnail'>
        <Button 
          type='button'
          variant='plain'
          className={cn('', {'bg-black-6': isAiThumbnail})}
          onClick={() => setIsAiThumbnail(true)}
        >
          Use AI to generate thumbnail
        </Button>
        <Button 
          type='button'
          variant='plain'
          className={cn('', { 'bg-black-6': !isAiThumbnail })}
          onClick={() => setIsAiThumbnail(false)}
        >
          Upload thumbnail
        </Button>
      </div>

      {isAiThumbnail ? (
        <div className='flex flex-col gap-5'> 
          <div className='flex flex-col gap-2.5 mt-5'>
            <Label className='text-16 font-bold text-white-1'>AI Prompt to generate thumbnail</Label>
            <Textarea
              className='input-class font-light focus-visible:ring-offset-orange-1'
              placeholder='Provide text to generate thumbnail'
              rows={5}
              value={props.imagePrompt}
              onChange={(e) => props.setImagePrompt(e.target.value)}
            />
          </div>
          <div className='w-full max-w-[200px]'>
            <Button
              type="submit"
              className="text-16 bg-orange-1 font-bold py-4 text-white-1"
              onClick={generateImage}
            >
              {isImageLoading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Generating
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className='image_div' onClick={() => imageRef?.current?.click()}>
          <Input 
            type='file' 
            className='hidden' 
            ref={imageRef} 
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src='./icons/upload-image.svg'
              width={40}
              height={40}
              alt='upload image'
            />
          ) : (
            <div className='text-16 flex-center font-medium text-white-1'>
              <Loader size={20} className='animate-spin mr-2' />
              Uploading
            </div>
          )}
          <div className='flex flex-col items-center gap-1'>
            <h2 className='text-12 font-bold text-orange-1'>Click to upload</h2>
            <p className='text-12 font-normal text-gray-1'>SVG, PNG, JPEG, GIF (max. 1080x1080px)</p>
          </div>
        </div>
      )}
      {props.image && (
        <div className='flex-center w-full'>
          <Image 
            src={props.image}
            width={200}
            height={200}
            className='mt-5'
            alt='thumbnail'
          />
        </div>
      )}
    </>
  )
}

export default GenerateThumbnail