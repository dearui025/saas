'use client'

import { useState } from 'react'

export default function APITestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    const results = []
    
    try {
      // 测试简单的GET请求
      results.push({ test: 'GET请求测试', status: '运行中...' })
      setTestResults([...results])
      
      const getResponse = await fetch('/api/simple-test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (getResponse.ok) {
        const getData = await getResponse.json()
        results[0] = { test: 'GET请求测试', status: `成功: ${JSON.stringify(getData)}` }
      } else {
        results[0] = { test: 'GET请求测试', status: `失败: ${getResponse.status} ${getResponse.statusText}` }
      }
      
      setTestResults([...results])
      
      // 测试POST请求
      results.push({ test: 'POST请求测试', status: '运行中...' })
      setTestResults([...results])
      
      const postResponse = await fetch('/api/simple-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (postResponse.ok) {
        const postData = await postResponse.json()
        results[1] = { test: 'POST请求测试', status: `成功: ${JSON.stringify(postData)}` }
      } else {
        results[1] = { test: 'POST请求测试', status: `失败: ${postResponse.status} ${postResponse.statusText}` }
      }
      
      setTestResults([...results])
    } catch (error: any) {
      results.push({ test: '总体测试', status: `错误: ${error.message}` })
      setTestResults([...results])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API 路由测试</h1>
        
        <button
          onClick={runTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '测试中...' : '运行测试'}
        </button>
        
        <div className="mt-8 space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="p-4 rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="font-medium">{result.test}:</span>
                <span className={result.status.includes('成功') ? 'text-green-600' : result.status.includes('失败') || result.status.includes('错误') ? 'text-red-600' : 'text-yellow-600'}>
                  {result.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">测试说明</h2>
          <p className="text-sm text-gray-700">
            此页面测试了API路由的基本功能。如果测试成功，说明API路由工作正常。
            如果测试失败，请检查控制台错误信息。
          </p>
        </div>
      </div>
    </div>
  )
}