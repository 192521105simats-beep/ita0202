# IT SERVICE REQUEST MANAGEMENT SYSTEM (CO4-AT2)
## VIVA VOCE & TECHNICAL INTERVIEW PREPARATION GUIDE

This document contains 25+ essential viva and interview questions with precise technical explanations covering **MVC Architecture**, **Servlets**, **JSP**, **RequestDispatcher vs. SendRedirect**, **Thread-Safety**, **Session/Request Scopes**, and **Web Data Representation**.

---

### Section 1: MVC Architecture & Enterprise Design

#### 1. What is the MVC architecture, and what are its primary advantages in web applications?
**Answer:**  
Model-View-Controller (MVC) is an architectural pattern that isolates application logic into three distinct components:
- **Model:** Represents the domain data, business logic, and entity state (e.g., `ServiceRequest.java`).
- **View:** Responsible for user interface rendering and presentation (e.g., `serviceRequest.jsp`, `acknowledgement.jsp`).
- **Controller:** Manages user requests, handles validation, orchestrates interactions between Model and View, and controls application navigation flow (e.g., `ServiceRequestServlet.java`).

**Key Advantages:**
1. **Separation of Concerns:** Clear demarcation between presentation logic and business processing.
2. **Maintainability:** Changes in UI design do not impact server-side data processing or database logic.
3. **Reusability & Testability:** Model classes (POJOs) can be reused across different front-ends and tested with standard unit tests (e.g., JUnit) without running a web server.
4. **Parallel Team Development:** Front-end developers can style JSP/CSS while back-end developers write Servlet controllers and Model business logic.

---

#### 2. Why should JSP pages NOT contain direct database access or heavy business logic?
**Answer:**  
Embedding business logic or SQL queries directly in JSP pages (commonly known as **Model 1 Architecture**) violates separation of concerns and leads to severe anti-patterns:
- **Spaghetti Code:** Mixing scriptlets (`<% ... %>`), SQL statements, and HTML makes debugging and maintainability extremely difficult.
- **Security Risks:** Lack of centralized input validation increases vulnerabilities like SQL Injection and Cross-Site Scripting (XSS).
- **Reduced Reusability:** Business logic embedded in JSP cannot be shared with other clients (e.g., REST APIs, mobile apps).
- **Inability to Test:** JSPs require a running web container (Tomcat) for compilation and execution, preventing simple automated unit testing.

---

#### 3. What is the difference between MVC Model 1 and MVC Model 2 architecture?
**Answer:**

| Feature | MVC Model 1 Architecture | MVC Model 2 Architecture |
| :--- | :--- | :--- |
| **Primary Controller** | JSP page acts as both View and Controller. | Servlet acts as the centralized Controller. |
| **Request Handling** | Browser sends requests directly to JSP. | Browser sends requests to Servlet Controller. |
| **Presentation Logic** | Mixed with business/database scriptlets. | Kept strictly separated in JSP views. |
| **Navigation Flow** | Controlled conditionally inside JSP pages. | Managed by Servlet using `RequestDispatcher`. |
| **Enterprise Fit** | Small, throwaway or prototype applications. | Scalable, maintainable enterprise systems. |

---

### Section 2: Java Servlets & Request Processing

#### 4. How does the Servlet lifecycle work from initialization to destruction?
**Answer:**  
The Servlet lifecycle is managed by the Servlet Container (such as Apache Tomcat) through three key lifecycle methods:
1. **Class Loading & Instantiation:** Container loads the servlet class and creates an instance.
2. **Initialization (`init()`):** Called once when the servlet is first loaded into memory. Used for one-time initialization (e.g., opening resource pools, reading config params).
3. **Request Servicing (`service()` / `doGet()` / `doPost()`):** For every incoming client request, the container spawns a new worker thread that invokes `service()`, which delegates to `doGet()` or `doPost()`.
4. **Destruction (`destroy()`):** Invoked once before the container removes the servlet from memory or shuts down. Used to release open resources (e.g., database connections, file handles).

---

#### 5. Why should form submissions use `doPost()` instead of `doGet()`?
**Answer:**
1. **Security & Privacy:** `GET` appends form parameters to the URL query string (`?employeeId=EMP1024&...`), exposing sensitive data in browser history, bookmarks, proxy logs, and server access logs. `POST` packages parameters inside the HTTP request body.
2. **Payload Size:** `GET` has URL length limits (typically ~2048 characters depending on browser/server), while `POST` supports arbitrarily large data (ideal for long multi-line descriptions and file uploads).
3. **Idempotency & Semantics:** HTTP `GET` is meant to be idempotent and safe (fetching data without side effects). HTTP `POST` is designed for state-changing operations (creating service requests, submitting transactions).

---

#### 6. Why is thread-safety critical in Servlets, and how did we ensure it in `ServiceRequestServlet`?
**Answer:**  
In Java web containers (Tomcat), **a single Servlet instance is shared across all concurrent client threads**. 
- If request parameters are stored in **instance variables** (fields declared outside methods in the class), one user's request thread can overwrite the variables of another user's request thread, leading to catastrophic race conditions and data corruption.
- **Solution implemented in `ServiceRequestServlet`:**
  1. All request parameters (`employeeId`, `employeeName`, `priority`, etc.) and intermediate validation results are declared strictly as **local variables inside the `doPost()` method**.
  2. Local variables reside on each thread's private stack frame, completely isolated from other concurrent requests.
  3. The request counter uses `java.util.concurrent.atomic.AtomicInteger` (`incrementAndGet()`), guaranteeing atomic, lock-free thread-safe ID increments across threads.

---

### Section 3: Navigation, Dispatching & Scopes

#### 7. What is the fundamental difference between `RequestDispatcher.forward()` and `HttpServletResponse.sendRedirect()`?
**Answer:**

| Characteristic | `RequestDispatcher.forward()` | `HttpServletResponse.sendRedirect()` |
| :--- | :--- | :--- |
| **Execution Location** | Server-side internal forward. | Client-side round-trip redirection. |
| **Number of Requests** | Exactly **1** HTTP request. | **2** distinct HTTP requests. |
| **Browser URL** | URL stays as `/ServiceRequestServlet` (does not change). | Browser URL changes to the target redirected URL. |
| **Request Attributes** | Preserved (`request.setAttribute` survives). | Lost (new HTTP request is created with clean scope). |
| **Speed** | Faster (no network round-trip). | Slower (requires client to make another HTTP request). |
| **Domain Constraint** | Can only forward within the same web application. | Can redirect to external domains/servers. |

---

#### 8. What are the four scopes in JSP/Servlet web applications?
**Answer:**
1. **Page Scope (`pageContext`):** Accessible only within the current JSP page. Destroyed once the page finishes rendering.
2. **Request Scope (`HttpServletRequest`):** Accessible throughout a single HTTP request lifecycle, including forwarded resources via `RequestDispatcher`. (Used in our assessment to pass the `ServiceRequest` object to `acknowledgement.jsp`).
3. **Session Scope (`HttpSession`):** Accessible across multiple HTTP requests from the same client/browser session. Preserved until session timeout or explicit invalidation (e.g., user authentication state, shopping cart).
4. **Application Scope (`ServletContext`):** Accessible by all users and all servlets/JSPs across the entire web application. Stays alive until the web server is stopped.

---

### Section 4: JSP, JavaBeans & Validation

#### 9. What makes a Java class a valid JavaBean, and how does `ServiceRequest.java` qualify?
**Answer:**  
A valid JavaBean must satisfy three core rules:
1. Must provide a **public default (no-argument) constructor**.
2. Must encapsulate fields as **private** variables.
3. Must provide **public getter and setter methods** following naming conventions (`getEmployeeId()`, `setEmployeeId()`).
4. Should implement `java.io.Serializable` for session replication and persistence.

`ServiceRequest.java` complies with all four requirements, enabling seamless interoperability with `<jsp:useBean>`, `<jsp:getProperty>`, and Expression Language (`${serviceRequest.employeeName}`).

---

#### 10. Why is server-side validation mandatory even if HTML5 client-side validation is implemented?
**Answer:**  
Client-side validation (HTML5 `required`, JavaScript regex) enhances user experience with instant feedback, but **can be easily bypassed** by:
- Disabling JavaScript in the browser.
- Using tools like Postman, cURL, or browser developer tools to send direct HTTP POST payloads.
- Tampering with HTTP parameters in proxy tools like Burp Suite.

Server-side validation in `ServiceRequestServlet.doPost()` is the authoritative security boundary that ensures only clean, valid, and sanitized data reaches the Model and database.
