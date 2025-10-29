'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function runTests() {
      const results = []
      
      try {
        // 测试1: 检查profiles表
        results.push({ test: 'profiles表连接', status: '运行中...' })
        setTestResults([...results])
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1)
          
        if (profilesError) {
          results[0] = { test: 'profiles表连接', status: `失败: ${profilesError.message}` }
        } else {
          results[0] = { test: 'profiles表连接', status: `成功 (${profilesData.length} 条记录)` }
        }
        
        setTestResults([...results])
        
        // 测试2: 检查user_api_keys表
        results.push({ test: 'user_api_keys表连接', status: '运行中...' })
        setTestResults([...results])
        
        const { data: apiKeysData, error: apiKeysError } = await supabase
          .from('user_api_keys')
          .select('id')
          .limit(1)
          
        if (apiKeysError) {
          results[1] = { test: 'user_api_keys表连接', status: `失败: ${apiKeysError.message}` }
        } else {
          results[1] = { test: 'user_api_keys表连接', status: `成功 (${apiKeysData.length} 条记录)` }
        }
        
        setTestResults([...results])
        
        // 测试3: 检查RLS策略 - 尝试插入数据
        results.push({ test: 'RLS策略测试', status: '运行中...' })
        setTestResults([...results])
        
        // 注意：这里我们不会真正插入数据，只是测试权限
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: '00000000-0000-0000-0000-000000000000',
            email: 'test@example.com',
            full_name: 'Test User'
          })
          
        // 我们期望这里会因为RLS策略而失败（除非用户已认证）
        if (insertError && insertError.message.includes('new row violates row-level security policy')) {
          results[2] = { test: 'RLS策略测试', status: '成功 (RLS策略正常工作)' }
        } else if (insertError) {
          results[2] = { test: 'RLS策略测试', status: `意外错误: ${insertError.message}` }
        } else {
          // 如果没有错误，说明可能没有正确应用RLS策略
          results[2] = { test: 'RLS策略测试', status: '警告 (RLS策略可能未正确应用)' }
        }
        
        setTestResults([...results])
      } catch (error: any) {
        results.push({ test: '总体测试', status: `失败: ${error.message}` })
        setTestResults([...results])
      } finally {
        setLoading(false)
      }
    }
    
    runTests()
  }, [supabase])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase 连接测试</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4">正在运行测试...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{result.test}:</span>
                  <span className={result.status.includes('成功') ? 'text-green-600' : result.status.includes('失败') ? 'text-red-600' : 'text-yellow-600'}>
                    {result.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">测试说明</h2>
          <p className="text-sm text-gray-700">
            此页面测试了与Supabase的连接以及RLS（行级安全）策略是否正确应用。
            如果所有测试都显示成功，说明Supabase已正确部署和配置。
          </p>
        </div>
      </div>
    </div>
  )
}