import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Link, router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { apiService } from "@/app/services/apiService";
import useStore from "@/app/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
WebBrowser.maybeCompleteAuthSession();

// Constants for SecureStore keys
const USER_DATA_KEY = "userData";
const AUTH_TOKEN_KEY = "authToken";
const WISHLIST_KEY = "wishlist";
const BASKET_KEY = "basket";

export default function Login() {
  const [showPassword, setShowPassword] = useState<any>(false);
  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const { setUser, setBasket, setWishlist } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: '208983196244-ct9ka44e5tli2aroh4kherpb94cqi37s.apps.googleusercontent.com',
    webClientId: '208983196244-s63qnp1i36mccagvm54b9b8h2t6t2cda.apps.googleusercontent.com', 
    redirectUri: 'http://localhost:8081',
  });


  // Function to handle Google login

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter a valid email and password");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: any = await apiService.login({ email, password });

      // Store user data securely
      await SecureStore.setItemAsync(
        USER_DATA_KEY,
        JSON.stringify(response.user)
      );
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
      await SecureStore.setItemAsync(
        WISHLIST_KEY,
        response.wishlists_count.toString()
      );
      await SecureStore.setItemAsync(
        BASKET_KEY,
        response.cart_count.toString()
      );

      // Update global state
      setUser({
        token: response.token,
        data: response.user,
      });
      setBasket(response.cart_count);
      setWishlist(response.wishlists_count);

      // Navigate to the main app
      router.push("/(tabs)");
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await promptAsync();

      if (result.type === "success") {
        const { idToken } = result.params;

        // Handle Google login with idToken
        // const response = await apiService.googleLogin({ idToken });

        // // Store user data securely
        // await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(response.user));
        // await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
        // await SecureStore.setItemAsync(WISHLIST_KEY, response.wishlists_count.toString());
        // await SecureStore.setItemAsync(BASKET_KEY, response.cart_count.toString());

        // // Update global state
        // setUser({
        //   token: response.token,
        //   data: response.user,
        // });
        // setBasket(response.cart_count);
        // setWishlist(response.wishlists_count);

        // // Navigate to the main app
        // router.push('/(tabs)');
        console.log(result);
      } else {
        setError("Google login failed. Please try again.");
      }
    } catch (error: any) {
      setError(error.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome back, glad to see{"\n"}you, Again!
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push("/forget-password")}>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>
          <Button title="Sign Out" onPress={signOut} />

          <Text style={styles.orText}>Or login with</Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton} onPress={signIn}>
              <Ionicons name="logo-google" size={24} color="#E97777" />
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Register now</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3639",
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 16,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 36,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 16,
  },
  passwordInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  forgotPassword: {
    color: "#fff",
    textAlign: "right",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#E97777",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "#fff",
  },
  registerLink: {
    color: "#E97777",
    fontWeight: "600",
  },
  errorContainer: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    color: "#E97777",
    fontSize: 16,
  },
});
