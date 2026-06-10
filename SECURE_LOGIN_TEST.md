# 🧪 Secure Login Test Plan

## Quick Start - Test These Scenarios

### ✅ Test 1: Guest to Checkout (Should Redirect to Login)
```
1. Clear browser localStorage:
   - Open DevTools → Console
   - localStorage.clear()
   - Refresh page

2. Go to http://localhost:3000/checkout
   
3. Expected Result:
   ✓ Shows "Secure Checkout" loading screen
   ✓ Shows toast: "Please login to proceed with checkout"
   ✓ Redirects to /sign-in automatically
```

---

### ✅ Test 2: Valid Login Flow
```
1. On /sign-in page, enter credentials:
   Email: admin@luxygalleria.com
   Password: password123

2. Click "Sign In"

3. Expected Result:
   ✓ Toast: "Signed in successfully!"
   ✓ Redirects to home page
   ✓ localStorage contains user data with token
```

---

### ✅ Test 3: After Login → Go to Checkout
```
1. After successful login, go to /checkout

2. Expected Result:
   ✓ Page loads checkout interface (no redirect)
   ✓ Shows "Secure Checkout" loading briefly
   ✓ Displays your saved addresses
   ✓ Can add new address
   ✓ Can proceed to payment
```

---

### ✅ Test 4: Invalid Login
```
1. On /sign-in, try:
   Email: admin@luxygalleria.com
   Password: wrongpassword

2. Click "Sign In"

3. Expected Result:
   ✓ Toast: "Invalid email or password"
   ✓ Stays on /sign-in page
   ✓ User NOT saved to localStorage
```

---

### ✅ Test 5: Logout & Reaccess Checkout
```
1. Clear localStorage:
   localStorage.clear()

2. Try to access /checkout

3. Expected Result:
   ✓ Toast: "Please login to proceed with checkout"
   ✓ Redirects to /sign-in page
   ✓ Full secure flow works!
```

---

## Debugging Commands

### Check User Data in localStorage
```javascript
// In DevTools Console
const user = localStorage.getItem('luxygalleria_user');
console.log(JSON.parse(user));

// Should show:
// {
//   "_id": "user123",
//   "name": "John Doe",
//   "email": "john@example.com",
//   "token": "eyJhbGc..."
// }
```

### Check API Response
```javascript
// In DevTools Network tab:
1. Go to /sign-in
2. Enter credentials and submit
3. Look for POST request to /api/v1/auth/customer-login
4. Check Response tab to see token
```

### Manual API Test (cURL)
```bash
# Test Sign In
curl -X POST http://localhost:5000/api/v1/auth/customer-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@luxygalleria.com","password":"password123"}'

# Expected Response:
# {"success":true,"data":{"_id":"...","token":"eyJhbGc..."}}
```

---

## Checklist

- [ ] Test 1: Guest redirect works
- [ ] Test 2: Valid login succeeds
- [ ] Test 3: Logged-in checkout loads
- [ ] Test 4: Invalid login fails properly
- [ ] Test 5: Logout/reaccess works
- [ ] localStorage shows correct token
- [ ] No console errors
- [ ] All toasts appear correctly
- [ ] Page loading states show properly

---

## Status

✅ **All security features are implemented and ready for testing**

If all tests pass, the secure login system is working correctly!
