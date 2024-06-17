## 노션 페이지를 ✨쓸만한✨ 블로그로!

### 어떻게요?
- [Super.so](https://super.so) 무료 계정 및 리버스 프록시 사용, 과정은 상술 예정   
- 비용 무료

### 방법 1 - CloudFlare Worker 사용

> [!WARNING]  
> 커스텀 도메인을 사용하려면 CloudFlare에 도메인을 먼저 등록해야 합니다

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/0chil/blog)
#### 환경변수
| 변수명 | 값 | 비고 |
| --- | --- | --- |
| TARGET_DOMAIN | super.so 도메인 |  |
| SERVE_DOMAIN | 블로그 도메인 | 커스텀 도메인이 없으면 기본 도메인 사용 |
| GISCUS_REPO | 댓글창 레포지터리 | [giscus.app](https://giscus.app) 에서 생성 가능 |
| GISCUS_REPO_ID | 댓글창 레포지터리 ID | [giscus.app](https://giscus.app) 에서 생성 가능 |
| GISCUS_CATEGORY | 댓글창 카테고리 | [giscus.app](https://giscus.app) 에서 생성 가능 |
| GISCUS_CATEGORY_ID | 댓글창 카테고리 ID | [giscus.app](https://giscus.app) 에서 생성 가능 |

### 방법 2 - NGINX 사용

상술 예정