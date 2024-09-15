#BE
```bash 
  npm start
```


1. features
   Chứa thông tin các tính năng của phim (có thể là các đặc điểm nổi bật của bộ phim như IMAX, 3D, phụ đề,...).
   Các trường:
   id: ID tính năng.
   title: Tên tính năng.
   description: Mô tả tính năng.
   image_path: Đường dẫn hình ảnh của tính năng.
   theatre_id: Tham chiếu tới bảng theatre (rạp chiếu phim) để liên kết tính năng với rạp chiếu.
2. hall
   Chứa thông tin về các phòng chiếu trong một rạp phim.
   Các trường:
   id: ID phòng chiếu.
   name: Tên phòng chiếu.
   total_seats: Tổng số ghế trong phòng chiếu.
   theatre_id: Tham chiếu tới bảng theatre (rạp chiếu phim).
3. hallwise_seat
   Bảng này liên kết giữa các phòng chiếu (hall) và ghế (seat).
   Các trường:
   hall_id: ID phòng chiếu.
   seat_id: ID ghế.
4. movie
   Chứa thông tin chi tiết về phim.
   Các trường:
   id: ID phim.
   name: Tên phim.
   image_path: Đường dẫn hình ảnh poster phim.
   language: Ngôn ngữ phim.
   synopsis: Tóm tắt nội dung phim.
   rating: Đánh giá phim (dạng decimal với 2 chữ số sau dấu phẩy).
   duration: Thời lượng phim.
   top_cast: Dàn diễn viên chính.
   release_date: Ngày phát hành phim.
   is_deleted: Trạng thái phim (1 hoặc 0, có thể là để xác định phim đã bị xóa hay chưa).
5. movie_directors
   Liên kết giữa phim và các đạo diễn của phim.
   Các trường:
   movie_id: ID phim (liên kết tới bảng movie).
   director: Tên đạo diễn.
6. movie_genre
   Liên kết giữa phim và thể loại phim.
   Các trường:
   movie_id: ID phim.
   genre: Thể loại phim (ví dụ: hành động, hài, kinh dị,...).
7. payment
   Chứa thông tin về các giao dịch thanh toán vé.
   Các trường:
   id: ID giao dịch thanh toán.
   (Các thông tin chi tiết về thanh toán có thể chưa được liệt kê rõ trong bảng này.)
8. person
   Chứa thông tin về người dùng hoặc khách hàng.
   Các trường:
   email: Email của người dùng (có thể là username).
   first_name: Tên.
   last_name: Họ.
   password: Mật khẩu (có thể đã được mã hóa).
   phone_number: Số điện thoại.
   account_balance: Số dư tài khoản.
   person_type: Loại người dùng (có thể là admin, khách hàng,...).
9. seat
   Chứa thông tin về các ghế ngồi trong rạp phim.
   Các trường:
   id: ID ghế.
   name: Tên ghế (ví dụ A1, B2,...).
10. shown_in
    Liên kết giữa phim, phòng chiếu, và suất chiếu.
    Các trường:
    movie_id: ID phim.
    showtime_id: ID suất chiếu (liên kết với bảng showtimes).
    hall_id: ID phòng chiếu.
11. showtimes
    Chứa thông tin về các suất chiếu phim.
    Các trường:
    id: ID suất chiếu.
    movie_start_time: Giờ bắt đầu chiếu.
    show_type: Loại suất chiếu (ví dụ: 2D, 3D,...).
    showtime_date: Ngày chiếu.
    price_per_seat: Giá vé cho mỗi ghế ngồi.
12. theatre
    Chứa thông tin về rạp chiếu phim.
    Các trường:
    id: ID rạp chiếu phim.
    name: Tên rạp chiếu.
    location: Địa điểm rạp chiếu phim.
    location_details: Chi tiết về địa điểm rạp chiếu.
13. ticket => Chứa thông tin về vé đã mua.
    Các trường:
    id: ID vé.
    price: Giá vé.
    purchase_date: Ngày mua vé.
    payment_id: Tham chiếu tới bảng payment (giao dịch thanh toán).
    seat_id: Tham chiếu tới bảng seat (ghế ngồi).
    hall_id: Tham chiếu tới bảng hall (phòng chiếu).
    movie_id: Tham chiếu tới bảng movie (phim).
    showtimes_id: Tham chiếu tới bảng showtimes (suất chiếu).



Tóm tắt:
Phim (movie) là trung tâm của hệ thống, được liên kết với các suất chiếu (showtimes), phòng chiếu (hall) và vé (ticket).
Người dùng (person) có thể mua vé, thanh toán (payment) và chọn ghế (seat) trong các suất chiếu của phim.
Các thông tin liên quan đến thể loại phim (movie_genre) và đạo diễn (movie_directors) cũng được lưu trữ riêng để quản lý thông tin phim chi tiết hơn.

