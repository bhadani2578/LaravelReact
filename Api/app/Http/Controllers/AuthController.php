<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use jcobhams\NewsApi\NewsApi;
use App\Models\User;
use Validator;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'userProfileUpdate']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
    	$validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (! $token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->createNewToken($token);
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|between:2,20',
            'last_name' => 'required|string|between:2,20',
            'phone' => 'required|string|between:5,12',
            'email' => 'required|string|email|max:30|unique:users',
            'password' => 'required|string|confirmed|min:6',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create(array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($request->password)]
                ));

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
    }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth()->logout();

        return response()->json(['message' => 'User successfully signed out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile(Request $request) {

        $newsapi = new NewsApi('34807bf092d84ce28bd40975066528c0');
        $totalCountry = $newsapi->getCountries();
        $categoryList = $newsapi->getCategories();

        // $q = 
        // $sources = $newsapi->getSources('business', 'en', 'us');
        // [
        //     "business",
        //     "entertainment",
        //     "general",
        //     "health",
        //     "science",
        //     "sports",
        //     "technology"
        // ]
        $url = 'https://newsapi.org/v2/top-headlines';
        $country = auth()->user()->country;
        $category = 'business';

        $fullUrl = "$url?country=$country&category=$category&apiKey=34807bf092d84ce28bd40975066528c0";

        $response = \Http::get($fullUrl);

        $data = $response->json();
        
        // $all_articles = $newsapi->getTopHeadlines('tesla', 'business',  20, 1);


        return response()->json(['user' =>auth()->user(), 'newsApi' => $data, 'totalCountry' => $totalCountry, 'categoryList' => $categoryList] );
    }

    /**
     * update a User Profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfileUpdate(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|between:2,20',
            'last_name' => 'required|string|between:2,20',
            'phone' => 'required|string|between:5,12'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::find($id);

if (!$user) {
    return response()->json(['error' => 'User not found'], 404);
}

$user->update(['first_name' => $request['first_name'], 'last_name' => $request['last_name'], 'email' => $request['email'], 'phone' => $request['phone'], 'country' => $request['country'], 'category' => $request['category']]);
       

        return response()->json([
            'message' => 'User successfully updated',
            'user' => $user
        ], 201);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token){
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }

}