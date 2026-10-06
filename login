curl -X POST http://localhost:3060/api/auth/login -H "Content-Type: application/json" -d '{"email":"johndoe@example.com","password":"password123"}'

{"authtoken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmFjNGRlYjkwMjVkOTA4MWI0YzgxNGM3In0sImlhdCI6MTc5MTI4Njk3NX0.M5LWNtSj1-8lch-Vyf8ekQuklgx6bQeyOCH_IS-d0Wo","userName":"John","userEmail":"johndoe@example.com"}
