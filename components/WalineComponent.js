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

<style>
  .waline-container {
    background-color: var(--card-background);
    border-radius: var(--card-border-radius);
    box-shadow: var(--shadow-l1);
    padding: 2%;
  }
  .waline-container .vcount {
    color: var(--card-text-color-main);
  }
  .v[data-class=v] .vcard {
    flex: 1;
    width: 0;
    padding-bottom: 0.5em;
    border-bottom: 0; /*删掉回复下面的线*/
}
@media (max-width: 580px){
.v[data-class=v] .vheader .vheader-item:not(:last-child) {
    border-bottom: 1px solid rgba(237,237,237,.8);   /*输入框分割线*/
}}

  /*日间模式*/
  :root {
    --waline-theme-color: #34495e; /*主题色，提交按钮*/
    --waline-active-color: #246BB1; /*鼠标移到提交按钮上的颜色*/
    /* 徽章 */
    --waline-badge-color: #34495e; /*博主徽章色*/
    --waline-avatar-radius: 5px;
    --waline-avatar-size: 6rem;
    --waline-dark-grey: #34495e; /*ID颜色*/
    --waline-text-color: #34495e; /*字体颜色*/
    --waline-font-size: 1.7rem; /*字体大小*/
  }

  /*夜间模式*/
  :root[data-scheme="dark"] {
    --waline-theme-color: #acc6e0;
    --waline-white: #34495e; /*按键字体颜色*/
    --waline-active-color: #8ab1d8;
    --waline-light-grey: #666;
    --waline-dark-grey: #acc6e0; /*ID颜色*/
    --waline-badge-color: #acc6e0;

    /* 布局颜色 */
    --waline-text-color: rgba(255, 255, 255, 0.7);
    --waline-bgcolor: #515151;
    --waline-bgcolor-light: #66696b; /*行内代码块颜色*/
    --waline-border-color: #9b9c9c;
    --waline-disable-bgcolor: #444;
    --waline-disable-color: #272727;

    /* 特殊颜色 */
    --waline-bq-color: #9b9c9c; /*quote*/

    /* 其他颜色 */
    --waline-info-bgcolor: #acc6e0;
    --waline-info-color: #9b9c9c;
  }

  .v[data-class="v"] .vcontent .vemoji {
    width: 2.2em; /*表情包大小修改*/
    margin: 0.25em;}

  .v[data-class=v] .vheader {
    border-bottom: 1px solid rgba(237,237,237,.8);  /*输入框分割线*/
      }
  .v[data-class=v] .vpanel {
    border-radius: 8px; /*输入框圆角*/
}


</style>



export default WalineComponent
