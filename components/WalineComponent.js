import React from 'react'
import { init } from '@waline/client'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import '@waline/client/dist/waline.css'

const path = ''
let waline = null
/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const WalineComponent = (props) => {
  const containerRef = React.createRef()
  const router = useRouter()

  const updateWaline = url => {
    if (url !== path && waline) {
      waline.update(props)
    }
  }

  React.useEffect(() => {
  // 添加自定义 CSS 样式
      const style = document.createElement('style');
      style.innerHTML = `
    :root {
      --waline-theme-color: #34495e
      --waline-active-color: #bababa
      --waline-badge-color: #34495e
      --waline-dark-grey: #34495e
      --waline-bgcolor: #f0f8ff
      --waline-bgcolor-light: #e9f3fb
      --waline-border-color: #3f4551
    }
    
    :root[data-scheme="dark"] {
      --waline-theme-color: #acc6e0
      --waline-white: #34495e;
      --waline-active-color: #8ab1d8
      --waline-light-grey: #666
      --waline-dark-grey: #acc6e0
      --waline-badge-color: #acc6e0
      /* 布局颜色等其他样式... */
    }
  `
  
  document.head.appendChild(style);
    
    if (!waline) {
      waline = init({
        ...props,
        el: containerRef.current,
        serverURL: BLOG.COMMENT_WALINE_SERVER_URL,
        lang: BLOG.lang,
        reaction: false,
        dark: 'html.dark',
        emoji: [
          '//cdn.jsdelivr.net/gh/Saidosi/azuki-emoji-for-waline@1.0/azukisan/',
          '//cdn.jsdelivr.net/gh/norevi/waline-blobcatemojis@1.0/blobs',
          '//cdn.jsdelivr.net/gh/norevi/blob-emoji-for-waline@2.0/blobs-gif'
        ]
      })
    }

    // 跳转评论
    router.events.on('routeChangeComplete', updateWaline)
    const anchor = window.location.hash
    if (anchor) {
      // 选择需要观察变动的节点
      const targetNode = document.getElementsByClassName('wl-cards')[0]

      // 当观察到变动时执行的回调函数
      const mutationCallback = (mutations) => {
        for (const mutation of mutations) {
          const type = mutation.type
          if (type === 'childList') {
            const anchorElement = document.getElementById(anchor.substring(1))
            if (anchorElement && anchorElement.className === 'wl-item') {
              anchorElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
              setTimeout(() => {
                anchorElement.classList.add('animate__animated')
                anchorElement.classList.add('animate__bounceInRight')
                observer.disconnect()
              }, 300)
            }
          }
        }
      }

      // 观察子节点 变化
      const observer = new MutationObserver(mutationCallback)
      observer.observe(targetNode, { childList: true })
    }

    return () => {
      if (waline) {
        waline.destroy()
        waline = null
      }
      router.events.off('routeChangeComplete', updateWaline)
    }
  }, [])

  return <div ref={containerRef} />
}

export default WalineComponent
