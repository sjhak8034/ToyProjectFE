import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// login api
export const login = async (
  email: string,
  password: string
): Promise<TokenResponse> => {
  try {
    // 로그인 API 호출
    const response: AxiosResponse = await api.post("/users/login", {
      email,
      password,
    });

    // Authorization 헤더에서 토큰 가져오기
    const token = response.headers.authorization;

    if (token) {
      // JWT 토큰의 payload를 분리 (디코딩)
      const payload = token.split(".")[1];

      // Payload 디코딩 예시 (base64 디코딩 필요)
      const decodedPayload = JSON.parse(atob(payload));

      console.log("Decoded Payload: ", decodedPayload);

      // 로컬 스토리지에 토큰 저장
      localStorage.setItem("access_token", token);
      console.log("로그인 성공 : ", token);
      alert("로그인 성공!");
      window.location.href = "/";
      // 사용자 역할에 따른 페이지 이동 처리
      // navigate("/dashboard"); // 예시로 대시보드로 이동
    } else {
      console.error("Authorization 헤더에 토큰이 없습니다.");
    }

    return response.data;
  } catch (error: unknown) {
    // 에러 처리
    if (axios.isAxiosError(error)) {
      // 서버가 응답을 반환한 경우 (Validation 오류 포함)
      if (error.response) {
        console.error("Validation error:", error.response.data);
        throw error.response.data; // 필요시 상위 컴포넌트로 전달
      } else {
        console.error("No response from server.");
      }
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

// google login api
export const googleLogin = async (): Promise<TokenResponse> => {
  try {
    // 로그인 API 호출
    const response: AxiosResponse = await api.post("/auth/oauth2-login");

    // Authorization 헤더에서 토큰 가져오기
    const token = getCookie("access_token");

    if (token) {
      // JWT 토큰의 payload를 분리 (디코딩)
      const payload = token.split(".")[1];

      // Payload 디코딩 예시 (base64 디코딩 필요)
      const decodedPayload = JSON.parse(atob(payload));

      console.log("Decoded Payload: ", decodedPayload);

      console.log("로그인 성공 : ", token);
      alert("로그인 성공!");
      window.location.href = "/";
      // 사용자 역할에 따른 페이지 이동 처
      // navigate("/dashboard"); // 예시로 대시보드로 이동
    } else {
      console.error("쿠키에 access_token이 없습니다.");
    }

    return response.data;
  } catch (error: unknown) {
    // 에러 처리
    if (axios.isAxiosError(error)) {
      // 서버가 응답을 반환한 경우 (Validation 오류 포함)
      if (error.response) {
        console.error("Validation error:", error.response.data);
        throw error.response.data; // 필요시 상위 컴포넌트로 전달
      } else {
        console.error("No response from server.");
      }
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};


// logout api
export const logout = async (
  navigate: (path: string) => void
): Promise<void> => {
  try {
    await api.post("/logout");
    alert("로그아웃 되었습니다.");
    navigate("/login");
  } catch (err) {
    // 실제로 로그아웃이 되었는지 확인 (예: 401, 403, 302 등도 성공으로 간주)
    alert("로그아웃 되었습니다.");
    navigate("/login");
    // 필요하다면 아래 로그는 남겨둡니다.
    const error = err as AxiosError;
    console.error("로그아웃 중 에러:", error.response?.data || error.message);
    // alert("로그아웃 실패: 서버 오류");
  }
};

// axios 인스턴스를 생성하여 기본 설정을 적용
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 인증이 필요 없는 경로 목록
const publicPaths: string[] = [
  "/refresh",
  "/users/login",
  "/users/signup",
  "/toss/fail",
  "/toss/success",
  "/toss/confirm",
];

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    const isPublicPath = publicPaths.some((path) => url.startsWith(path));

    if (!isPublicPath) {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers["Authorization"] = token;
      }
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<AxiosResponse | void> => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = token as string;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Attempting to refresh token");
        const response = await api.post("/refresh");
        const newAccessToken = response.headers["authorization"];

        console.log(newAccessToken);

        if (!newAccessToken) {
          throw new Error("액세스 토큰이 반환되지 않았습니다.");
        }

        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common["Authorization"] = newAccessToken;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = newAccessToken;
        }

        return api(originalRequest);
      } catch (refreshError: unknown) {
        isRefreshing = false;

        if (axios.isAxiosError(refreshError)) {
          console.error(
            "Failed to refresh token:",
            refreshError.response?.data || refreshError.message
          );

          processQueue(refreshError, null);

          if (refreshError.response?.status === 401) {
            delete api.defaults.headers.common["Authorization"];
            window.location.href = "/login";
          }
        } else {
          console.error("An unexpected error occurred:", refreshError);
          processQueue(refreshError, null);
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 쿠키에서 특정 이름의 값을 가져오는 함수
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift()!;
  return null;
}

export default api;
