import './App.css'
import {useEffect, useState} from "react";
import {client} from "./hono-client.ts";

export default function App() {
  const [getData, setGetData] = useState('')
  const [postData, setPostData] = useState('')

  useEffect(() => {
    (async function () {
      const result = await client.posts.$get()
      const data = await result.text()
      setGetData(data)

      const postResult = await client.posts.$post({form: {title: 'foo', body: 'bar'}})
      const json = await postResult.json()
      setPostData(JSON.stringify(json))
    })()
  }, []);

  return (
    <>
      <div>{getData}</div>
      <div>{postData}</div>
    </>
  )
}
