import React, { useEffect, useState } from 'react'

interface IProps {
  className?: string
  children?: string | string[]
  chatId: string
}

const symbols: string =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

const HackyChatId: React.FC<IProps> = (props) => {
  const [chatId, setChatId] = useState(props.chatId)

  useEffect(() => {
    let iteration = 0

    const interval = setInterval(() => {
      setChatId(
        chatId
          .split('')
          .map((_letter, index) => {
            if (index < iteration) {
              return props.chatId[index]
            }

            return symbols[Math.floor(Math.random() * symbols.length)]
          })
          .join(''),
      )

      if (iteration >= props.chatId.length) {
        clearInterval(interval)
      }

      iteration += 1 / 3
    }, 40)
  }, [])

  return (
    <div className={props.className}>
      {props.children}
      {chatId}
    </div>
  )
}
export default HackyChatId
