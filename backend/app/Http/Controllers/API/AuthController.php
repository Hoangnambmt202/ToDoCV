<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signUp(Request $request)
    {
        $data = $request->validate([
            'name' => 'string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $request->session()->regenerate();
        return response()->json([
            'message'      => 'Đăng ký thành công',
            'user'         => $user
        ], 200);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Sai thông tin đăng nhập'], 401);
        }
        // Tạo session và cookie xác thực
        $request->session()->regenerate();

        return response()->json([
            'message'      => 'Đăng nhập thành công',
            'user'         => $user
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Đăng xuất thành công.']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}

