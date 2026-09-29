import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sqicpllcgerwydrmwjqu.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_PshFpqGI5igv7fKiIGPsaQ_wouAItW1'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// true = đã hết hạn khảo sát
const SURVEY_CLOSED = true

export default function App() {
  const [view, setView] = useState(SURVEY_CLOSED ? 'closed' : 'form')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0 })

  const loadResults = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('khao_sat_phieu1')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setResults(data || [])
      calculateStats(data || [])
    } catch (err) {
      console.error(err)
      alert('Không tải được kết quả khảo sát')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data) => {
    const total = data.length
    if (total === 0) {
      setStats({ total: 0 })
      return
    }

    const allAnswers = data.map(item => item.answers || {})

    const count = (field) => {
      const counts = {}
      allAnswers.forEach(ans => {
        const value = ans[field]
        if (Array.isArray(value)) {
          value.forEach(v => {
            if (v) counts[v] = (counts[v] || 0) + 1
          })
        } else if (value) {
          counts[value] = (counts[value] || 0) + 1
        }
      })
      return counts
    }

    setStats({
      total,
      co_quan: count('co_quan'),
      cap_cong_tac: count('cap_cong_tac'),
      nganh: count('nganh'),
      thoi_gian: count('thoi_gian'),
      cau1: count('cau1'),
      cau2: count('cau2'),
      cau3: count('cau3'),
      cau4: count('cau4'),
      cau5: count('cau5'),
      cau6: count('cau6'),
      cau7: count('cau7'),
      cau8: count('cau8'),
      cau9: count('cau9'),
      cau10: count('cau10'),
      cau11: count('cau11'),
      cau12: count('cau12'),
      cau13: count('cau13'),
      cau14: count('cau14'),
      cau15: count('cau15'),
    })
  }

  // Component hiển thị 1 câu hỏi có thanh tiến trình
  const QuestionStat = ({ title, data }) => {
    if (!data || Object.keys(data).length === 0) return null
    const total = stats.total || 1
    const sorted = Object.entries(data).sort((a, b) => b[1] - a[1])

    return (
      <div className="mb-8">
        <h3 className="font-medium text-gray-800 mb-3">{title}</h3>
        <div className="space-y-3">
          {sorted.map(([option, count]) => {
            const percent = ((count / total) * 100).toFixed(1)
            return (
              <div key={option}>
                <div className="flex justify-between text-sm mb-1 gap-2">
                  <span className="text-gray-700 flex-1">{option}</span>
                  <span className="font-medium text-red-700 whitespace-nowrap">{count} ({percent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ========== MÀN HÌNH ĐÃ HẾT HẠN ==========
  if (view === 'closed') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center border-t-4 border-red-700">
          <div className="text-5xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-red-800 mb-3">Đã hết hạn điền khảo sát</h2>
          <p className="text-gray-600 mb-6">
            Thời gian thu thập phiếu khảo sát đã kết thúc.<br />
            Xin cảm ơn Ông/Bà đã quan tâm và tham gia.
          </p>
          <button
            onClick={() => {
              setView('results')
              loadResults()
            }}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            Xem kết quả khảo sát
          </button>
          <p className="text-xs text-gray-500 mt-6">© UBND phường Thành Nhất – Tỉnh Đắk Lắk</p>
        </div>
      </div>
    )
  }

  // ========== MÀN HÌNH KẾT QUẢ ĐẦY ĐỦ ==========
  if (view === 'results') {
    return (
      <div className="min-h-screen bg-gray-100 py-6 px-3 sm:px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border-t-4 border-red-700 p-5 sm:p-6 mb-4">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-red-800">Kết quả khảo sát</h1>
                <p className="text-sm text-gray-600 mt-1">Phiếu số 01 – UBND phường Thành Nhất</p>
              </div>
              <button
                onClick={() => setView('closed')}
                className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 whitespace-nowrap"
              >
                ← Quay lại
              </button>
            </div>

            <div className="mt-5 p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-center text-red-800 font-medium">
                Tổng số phản hồi đã ghi nhận: <span className="text-2xl font-bold">{stats.total || 0}</span>
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="inline-block w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600">Đang tải kết quả khảo sát...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* A. Thông tin chung */}
              <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
                <h2 className="text-lg font-bold text-red-800 mb-5 border-b border-red-100 pb-2">A. Thông tin chung</h2>
                
                <QuestionStat title="2. Cấp công tác" data={stats.cap_cong_tac} />
                <QuestionStat title="3. Ngành/lĩnh vực quản lý hoặc công tác chủ yếu" data={stats.nganh} />
                <QuestionStat title="4. Thời gian tham gia công tác liên quan đến an toàn thực phẩm" data={stats.thoi_gian} />
              </div>

              {/* B. Phần khảo sát */}
              <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
                <h2 className="text-lg font-bold text-red-800 mb-5 border-b border-red-100 pb-2">B. Phần khảo sát</h2>

                <QuestionStat title="Câu 1. Đơn vị/địa phương đã tuyên truyền, phổ biến pháp luật về an toàn thực phẩm bằng hình thức nào?" data={stats.cau1} />
                <QuestionStat title="Câu 2. Ông/bà đánh giá về hiệu quả của hoạt động tuyên truyền, phổ biến pháp luật về an toàn thực phẩm thời gian qua?" data={stats.cau2} />
                <QuestionStat title="Câu 3. Ông/bà đánh giá về việc bố trí nguồn lực thực hiện công tác thi hành pháp luật về an toàn thực phẩm tại đơn vị/địa phương?" data={stats.cau3} />
                <QuestionStat title="Câu 4. Lý do việc bố trí nguồn lực chưa bảo đảm" data={stats.cau4} />
                <QuestionStat title="Câu 5. Các hành vi vi phạm pháp luật trong quản lý thực phẩm chức năng đã xảy ra thời gian qua" data={stats.cau5} />
                <QuestionStat title="Câu 6. Những khó khăn, vướng mắc thường gặp trong công tác quản lý thực phẩm chức năng" data={stats.cau6} />
                <QuestionStat title="Câu 7. Các hành vi vi phạm pháp luật trong kiểm nghiệm thực phẩm đã xảy ra" data={stats.cau7} />
                <QuestionStat title="Câu 8. Hành vi vi phạm tại các cơ sở không thuộc diện cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm" data={stats.cau8} />
                <QuestionStat title="Câu 9. Khó khăn, vướng mắc trong quản lý cơ sở không thuộc diện cấp Giấy chứng nhận" data={stats.cau9} />
                <QuestionStat title="Câu 10. Đánh giá về việc triển khai và hiệu quả công tác thanh tra, kiểm tra" data={stats.cau10} />
                <QuestionStat title="Câu 11. Các hình thức xử lý vi phạm pháp luật về an toàn thực phẩm đã áp dụng" data={stats.cau11} />
                <QuestionStat title="Câu 12. Đánh giá về tính kịp thời, hiệu quả khi áp dụng Nghị định số 90/2026/NĐ-CP" data={stats.cau12} />
                <QuestionStat title="Câu 13. Nguyên nhân chủ yếu dẫn đến vi phạm pháp luật về an toàn thực phẩm" data={stats.cau13} />
                <QuestionStat title="Câu 14. Đánh giá về hoạt động phối hợp giữa các cơ quan, đơn vị" data={stats.cau14} />
                <QuestionStat title="Câu 15. Giải pháp nâng cao hiệu lực, hiệu quả quản lý nhà nước về an toàn thực phẩm" data={stats.cau15} />
              </div>

              <div className="text-center pt-2 pb-6">
                <button
                  onClick={() => setView('closed')}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
                >
                  ← Quay lại
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
