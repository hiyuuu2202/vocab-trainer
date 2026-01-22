# 📘 Daily Vocabulary Trainer

Một website học từ vựng đơn giản nhưng hiệu quả, chạy hoàn toàn trên **GitHub Pages**, không cần backend, không cần tài khoản.

---

## 🎯 Mục tiêu

- Nhập từ vựng + nghĩa mỗi ngày
- Kiểm tra từ vựng theo dạng trắc nghiệm
- Mỗi từ có điểm tích lũy
- Từ nào đạt **3 điểm** sẽ được coi là **đã thuộc** và tự động xóa
- Dữ liệu lưu **local trên trình duyệt** (localStorage)

---

## 🧠 Cách hoạt động

- Mỗi từ bắt đầu với `score = 0`
- Mỗi lần trả lời đúng: `+1 điểm`
- Khi `score >= 3` → từ đó sẽ bị xóa khỏi danh sách
- Mỗi lượt kiểm tra:
  - Random **tối đa 5 từ**
  - Nếu ít hơn 5 từ → lấy toàn bộ

---

## ✍️ Cách nhập từ vựng

Nhập theo định dạng:

```text
apple - quả táo
banana - quả chuối
cat - con mèo
