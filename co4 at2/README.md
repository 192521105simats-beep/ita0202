# WEB TECHNOLOGY
## UNIT IV - REPRESENTING WEB DATA
### ASSESSMENT II: INDUSTRY PROBLEM SOLVING TASK (CO4-AT2)

**Duration:** 60 Minutes | **Maximum Marks:** 30 | **Mode:** Individual Assessment Unit IV

---

## Scenario: IT Service Request Management System

A software company receives internal technical complaints relating to network connectivity, software installation, account access, hardware problems, and application errors. Employees currently report these issues through email, making it difficult for the IT support team to organize and track requests. 

The company wants a web-based **IT Service Request Management System**. Employees enter their **Employee ID**, **Employee Name**, **Department**, **Problem Category**, **Problem Description**, and **Priority**. After submission, the system validates the information, creates a service request, and displays an acknowledgement page. The application strictly follows the **Model-View-Controller (MVC)** architectural pattern using **JSP**, a **Servlet**, and a **Java Model class**.

---

## Evaluation Rubric & Mark Distribution

| Criterion | Target Application Component | Marks |
| :--- | :--- | :---: |
| **Q1:** JSP input form and appropriate controls | `serviceRequest.jsp` | **7** |
| **Q2:** Correct Java Model class | `ServiceRequest.java` | **5** |
| **Q3:** Servlet processing, validation and forwarding | `ServiceRequestServlet.java` | **10** |
| **Q4:** JSP acknowledgement and MVC explanation | `acknowledgement.jsp` | **8** |
| **Total Marks** | | **30** |

---

## MVC Component Mapping

| MVC Component | Application Component | File Location | Responsibility |
| :--- | :--- | :--- | :--- |
| **Model** | `ServiceRequest.java` | `src/com/itservice/model/ServiceRequest.java` | Encapsulates service ticket state, employee data, priority, and timestamps. Pure POJO/JavaBean. |
| **View (Input)** | `serviceRequest.jsp` | `serviceRequest.jsp` | Collects employee details and issue parameters via an HTML5 form; displays server validation error messages. |
| **Controller** | `ServiceRequestServlet.java` | `src/com/itservice/controller/ServiceRequestServlet.java` | Intercepts HTTP `POST`, sanitizes & validates parameters, instantiates Model, generates Ticket ID, forwards to View. |
| **View (Result)** | `acknowledgement.jsp` | `acknowledgement.jsp` | Extracts Model attributes from Request scope, renders confirmation ticket, and presents MVC explanation. |

---

## End-to-End Execution Flow

```
[ Employee / Browser ]
         │
         ▼
 1. [ serviceRequest.jsp ] (View: Form Input)
         │
         │  HTTP POST (employeeId, name, dept, category, desc, priority)
         ▼
 2. [ ServiceRequestServlet.doPost() ] (Controller)
         │
         ├──► 3. Server-Side Validation
         │         ├─ If Invalid ──► Set Error List ──► RequestDispatcher.forward() ──► [ serviceRequest.jsp ]
         │         └─ If Valid   ──► Continue
         │
         ├──► 4. Generate Request Number (e.g., "SR-1001" via AtomicInteger)
         │
         ├──► 5. Instantiate Model Object: ServiceRequest requestObj = new ServiceRequest(...)
         │
         ├──► 6. Set Request Attributes: request.setAttribute("serviceRequest", requestObj)
         │
         ▼  7. RequestDispatcher.forward("acknowledgement.jsp")
 8. [ acknowledgement.jsp ] (View: Result & Confirmation)
         │
         ▼
[ Confirmation Ticket & MVC Explanation Displayed to Employee ]
```

---

## Question 1: Design the View - JSP Form (7 Marks)

### File: `serviceRequest.jsp`

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IT Service Request Management System - View (JSP)</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="app-header">
        <div class="header-container">
            <div class="badge-tag">UNIT IV - ASSESSMENT II | MVC VIEW (JSP)</div>
            <h1>IT Service Request Management System</h1>
            <p class="subtitle">Internal IT Technical Complaints Portal</p>
        </div>
    </header>

    <main class="main-container">
        <div class="glass-card" style="max-width: 800px; margin: 0 auto;">
            <h2>Submit IT Service Request</h2>
            
            <%-- Server-Side Validation Error Feedback --%>
            <%
                List<String> errors = (List<String>) request.getAttribute("errors");
                if (errors != null && !errors.isEmpty()) {
            %>
                <div class="alert alert-danger">
                    <strong>Please correct the following errors:</strong>
                    <ul>
                        <% for (String err : errors) { %>
                            <li><%= err %></li>
                        <% } %>
                    </ul>
                </div>
            <% } %>

            <%-- Sticky Form Parameter Retrieval --%>
            <%
                String prevEmpId = request.getAttribute("prevEmployeeId") != null ? (String) request.getAttribute("prevEmployeeId") : "";
                String prevEmpName = request.getAttribute("prevEmployeeName") != null ? (String) request.getAttribute("prevEmployeeName") : "";
                String prevDept = request.getAttribute("prevDepartment") != null ? (String) request.getAttribute("prevDepartment") : "";
                String prevCat = request.getAttribute("prevCategory") != null ? (String) request.getAttribute("prevCategory") : "";
                String prevDesc = request.getAttribute("prevDescription") != null ? (String) request.getAttribute("prevDescription") : "";
                String prevPrio = request.getAttribute("prevPriority") != null ? (String) request.getAttribute("prevPriority") : "Medium";
            %>

            <!-- Form submitting to Controller Servlet using POST method -->
            <form action="ServiceRequestServlet" method="POST">
                
                <!-- Q1.a: Employee ID & Employee Name -->
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="employeeId">Employee ID *</label>
                        <input type="text" id="employeeId" name="employeeId" class="form-control" 
                               placeholder="e.g. EMP-1024" value="<%= prevEmpId %>" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="employeeName">Employee Name *</label>
                        <input type="text" id="employeeName" name="employeeName" class="form-control" 
                               placeholder="e.g. Jane Smith" value="<%= prevEmpName %>" required>
                    </div>
                </div>

                <!-- Q1.b & Q1.c: Department & Problem Category -->
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="department">Department *</label>
                        <select id="department" name="department" class="form-select" required>
                            <option value="">-- Select Department --</option>
                            <option value="Software Engineering" <%= "Software Engineering".equals(prevDept) ? "selected" : "" %>>Software Engineering</option>
                            <option value="Information Technology" <%= "Information Technology".equals(prevDept) ? "selected" : "" %>>Information Technology</option>
                            <option value="Human Resources" <%= "Human Resources".equals(prevDept) ? "selected" : "" %>>Human Resources</option>
                            <option value="Finance & Accounts" <%= "Finance & Accounts".equals(prevDept) ? "selected" : "" %>>Finance & Accounts</option>
                            <option value="Marketing & Sales" <%= "Marketing & Sales".equals(prevDept) ? "selected" : "" %>>Marketing & Sales</option>
                            <option value="Operations" <%= "Operations".equals(prevDept) ? "selected" : "" %>>Operations</option>
                            <option value="Quality Assurance" <%= "Quality Assurance".equals(prevDept) ? "selected" : "" %>>Quality Assurance</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="problemCategory">Problem Category *</label>
                        <select id="problemCategory" name="problemCategory" class="form-select" required>
                            <option value="">-- Select Category --</option>
                            <option value="Network" <%= "Network".equals(prevCat) ? "selected" : "" %>>Network</option>
                            <option value="Software" <%= "Software".equals(prevCat) ? "selected" : "" %>>Software</option>
                            <option value="Hardware" <%= "Hardware".equals(prevCat) ? "selected" : "" %>>Hardware</option>
                            <option value="Account" <%= "Account".equals(prevCat) ? "selected" : "" %>>Account</option>
                            <option value="Other" <%= "Other".equals(prevCat) ? "selected" : "" %>>Other</option>
                        </select>
                    </div>
                </div>

                <!-- Q1.e: Priority Level -->
                <div class="form-group">
                    <label class="form-label">Priority Level *</label>
                    <div class="radio-group">
                        <label><input type="radio" name="priority" value="Low" <%= "Low".equals(prevPrio) ? "checked" : "" %>> Low</label>
                        <label><input type="radio" name="priority" value="Medium" <%= "Medium".equals(prevPrio) ? "checked" : "" %>> Medium</label>
                        <label><input type="radio" name="priority" value="High" <%= "High".equals(prevPrio) ? "checked" : "" %>> High</label>
                    </div>
                </div>

                <!-- Q1.d: Problem Description Multi-Line Control -->
                <div class="form-group">
                    <label class="form-label" for="problemDescription">Problem Description *</label>
                    <textarea id="problemDescription" name="problemDescription" class="form-textarea" 
                              rows="4" placeholder="Detailed description of technical issue..." required><%= prevDesc %></textarea>
                </div>

                <!-- Q1.f: Clear Submit & Reset Buttons -->
                <div class="form-actions">
                    <button type="reset" class="btn btn-secondary">Reset</button>
                    <button type="submit" class="btn btn-primary">Submit Service Request</button>
                </div>
            </form>
        </div>
    </main>
</body>
</html>
```

### Technical Features of the View:
1. **Form Method:** Uses `method="POST"` to securely send payload in the HTTP request body without exposing sensitive parameters in the query string.
2. **Form Action:** Targets `ServiceRequestServlet` controller.
3. **Controls Utilized:** Single-line text inputs (`employeeId`, `employeeName`), styled dropdown select elements (`department`, `problemCategory`), multi-line `<textarea>` (`problemDescription`), and radio button options (`priority`).
4. **Input Sticky State:** Implements request attribute repopulation so users do not lose their typed data if server validation fails.

---

## Question 2: Develop the Model - Java Class (5 Marks)

### File: `src/com/itservice/model/ServiceRequest.java`

```java
package com.itservice.model;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Model Class: ServiceRequest
 * Encapsulates service ticket data for the MVC architecture.
 * Implements JavaBean specifications without presentation-specific logic.
 */
public class ServiceRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    // Required fields (Question 2.a)
    private String employeeId;
    private String employeeName;
    private String department;
    private String problemCategory;
    private String problemDescription;
    private String priority;

    // Operational ticket fields
    private String requestId;
    private String submissionDate;
    private String status;

    /**
     * Default No-Argument Constructor (Question 2.b)
     */
    public ServiceRequest() {
        this.status = "Open / Assigned to IT Queue";
        this.submissionDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }

    /**
     * Parameterized Constructor (Question 2.b)
     */
    public ServiceRequest(String employeeId, String employeeName, String department,
                          String problemCategory, String problemDescription, String priority) {
        this();
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.department = department;
        this.problemCategory = problemCategory;
        this.problemDescription = problemDescription;
        this.priority = priority;
    }

    public ServiceRequest(String requestId, String employeeId, String employeeName,
                          String department, String problemCategory,
                          String problemDescription, String priority) {
        this(employeeId, employeeName, department, problemCategory, problemDescription, priority);
        this.requestId = requestId;
    }

    // Question 2.c: Getter and Setter Methods

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId != null ? employeeId.trim() : "";
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName != null ? employeeName.trim() : "";
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department != null ? department.trim() : "";
    }

    public String getProblemCategory() {
        return problemCategory;
    }

    public void setProblemCategory(String problemCategory) {
        this.problemCategory = problemCategory != null ? problemCategory.trim() : "";
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription != null ? problemDescription.trim() : "";
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority != null ? priority.trim() : "";
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(String submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEstimatedResolutionTime() {
        if ("High".equalsIgnoreCase(priority)) {
            return "Within 4 Hours (Critical SLA)";
        } else if ("Medium".equalsIgnoreCase(priority)) {
            return "Within 24 Hours (Standard SLA)";
        } else {
            return "Within 48-72 Hours (Normal SLA)";
        }
    }

    @Override
    public String toString() {
        return "ServiceRequest [requestId=" + requestId + ", employeeId=" + employeeId +
               ", employeeName=" + employeeName + ", department=" + department +
               ", problemCategory=" + problemCategory + ", priority=" + priority + "]";
    }
}
```

---

## Question 3: Develop the Controller Servlet (10 Marks)

### File: `src/com/itservice/controller/ServiceRequestServlet.java`

```java
package com.itservice.controller;

import com.itservice.model.ServiceRequest;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Controller: ServiceRequestServlet
 * Implements Question 3 (a to h).
 */
@WebServlet(name = "ServiceRequestServlet", urlPatterns = {"/ServiceRequestServlet", "/service-request"})
public class ServiceRequestServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // AtomicInteger provides thread-safe sequential ID generation across concurrent threads
    private static final AtomicInteger requestCounter = new AtomicInteger(1000);

    private static final List<String> VALID_CATEGORIES = Arrays.asList(
            "Network", "Software", "Hardware", "Account", "Other"
    );
    private static final List<String> VALID_PRIORITIES = Arrays.asList(
            "Low", "Medium", "High"
    );

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("serviceRequest.jsp").forward(request, response);
    }

    /**
     * Q3.a: Handle submitted form via doPost()
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Q3.h: All request-specific parameters stored in LOCAL VARIABLES for Thread-Safety
        request.setCharacterEncoding("UTF-8");

        // Q3.b: Read all submitted values using request.getParameter()
        String employeeId = request.getParameter("employeeId");
        String employeeName = request.getParameter("employeeName");
        String department = request.getParameter("department");
        String problemCategory = request.getParameter("problemCategory");
        String problemDescription = request.getParameter("problemDescription");
        String priority = request.getParameter("priority");

        if (employeeId != null) employeeId = employeeId.trim();
        if (employeeName != null) employeeName = employeeName.trim();
        if (department != null) department = department.trim();
        if (problemCategory != null) problemCategory = problemCategory.trim();
        if (problemDescription != null) problemDescription = problemDescription.trim();
        if (priority != null) priority = priority.trim();

        // Q3.c: Validate all mandatory fields & handle missing input
        List<String> validationErrors = new ArrayList<>();

        if (employeeId == null || employeeId.isEmpty()) {
            validationErrors.add("Employee ID is mandatory.");
        } else if (!employeeId.matches("^[a-zA-Z0-9_-]{3,20}$")) {
            validationErrors.add("Employee ID must be 3-20 alphanumeric characters (e.g. EMP-1024).");
        }

        if (employeeName == null || employeeName.isEmpty()) {
            validationErrors.add("Employee Name is mandatory.");
        } else if (employeeName.length() < 2 || employeeName.length() > 60) {
            validationErrors.add("Employee Name must be between 2 and 60 characters.");
        }

        if (department == null || department.isEmpty()) {
            validationErrors.add("Please select a valid Department.");
        }

        if (problemCategory == null || problemCategory.isEmpty()) {
            validationErrors.add("Problem Category is mandatory.");
        } else if (!VALID_CATEGORIES.contains(problemCategory)) {
            validationErrors.add("Invalid Problem Category selected.");
        }

        if (problemDescription == null || problemDescription.isEmpty()) {
            validationErrors.add("Problem Description is mandatory.");
        } else if (problemDescription.length() < 10) {
            validationErrors.add("Problem Description must contain at least 10 characters.");
        }

        if (priority == null || priority.isEmpty()) {
            validationErrors.add("Priority level is mandatory.");
        } else if (!VALID_PRIORITIES.contains(priority)) {
            validationErrors.add("Invalid Priority selected. Allowed: Low, Medium, High.");
        }

        // If validation fails, forward back to input view with error messages
        if (!validationErrors.isEmpty()) {
            request.setAttribute("errors", validationErrors);
            request.setAttribute("prevEmployeeId", employeeId);
            request.setAttribute("prevEmployeeName", employeeName);
            request.setAttribute("prevDepartment", department);
            request.setAttribute("prevCategory", problemCategory);
            request.setAttribute("prevDescription", problemDescription);
            request.setAttribute("prevPriority", priority);

            RequestDispatcher dispatcher = request.getRequestDispatcher("serviceRequest.jsp");
            dispatcher.forward(request, response);
            return;
        }

        // Q3.e: Generate Request Number (e.g. SR-1001)
        int nextNum = requestCounter.incrementAndGet();
        String requestId = "SR-" + nextNum;

        // Q3.d: Create Model object using validated values
        ServiceRequest serviceRequest = new ServiceRequest(
                requestId,
                employeeId,
                employeeName,
                department,
                problemCategory,
                problemDescription,
                priority
        );

        // Q3.f: Store Model object and Request Number as request attributes
        request.setAttribute("serviceRequest", serviceRequest);
        request.setAttribute("requestId", requestId);
        request.setAttribute("successMessage", "Service Request registered successfully.");

        // Q3.g: Forward successful request to acknowledgement.jsp
        RequestDispatcher dispatcher = request.getRequestDispatcher("acknowledgement.jsp");
        dispatcher.forward(request, response);
    }
}
```

---

## Question 4: Develop Result View & Explain MVC (8 Marks)

### File: `acknowledgement.jsp`

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.itservice.model.ServiceRequest" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Acknowledgement - IT Service Desk</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <%
        ServiceRequest reqObj = (ServiceRequest) request.getAttribute("serviceRequest");
        String reqId = (String) request.getAttribute("requestId");
        if (reqObj == null) {
            reqObj = new ServiceRequest("SR-1001", "EMP-1024", "John Doe", "Engineering", "Network", "VPN issue", "High");
            reqId = "SR-1001";
        }
    %>

    <header class="app-header">
        <div class="header-container">
            <div class="badge-tag">UNIT IV - ASSESSMENT II | MVC RESULT VIEW (JSP)</div>
            <h1>IT Service Request Acknowledgement</h1>
        </div>
    </header>

    <main class="main-container">
        <!-- Q4.b: Confirmation Message -->
        <div class="alert alert-success">
            <strong>✅ Service Request Submitted Successfully!</strong>
            <p>Your request has been logged into the IT queue and assigned to an engineer.</p>
        </div>

        <!-- Q4.a: Displaying Processed Ticket Information -->
        <div class="ticket-card">
            <div class="ticket-header">
                <div>
                    <span>Service Request Number</span>
                    <div class="ticket-id-badge"><%= reqId %></div>
                </div>
                <div>
                    <span class="pill-badge badge-primary">Status: <%= reqObj.getStatus() %></span>
                    <span class="pill-badge badge-danger">Priority: <%= reqObj.getPriority() %></span>
                </div>
            </div>

            <div class="ticket-details-grid">
                <div class="ticket-item">
                    <div class="item-label">Employee ID</div>
                    <div class="item-value"><code><%= reqObj.getEmployeeId() %></code></div>
                </div>
                <div class="ticket-item">
                    <div class="item-label">Employee Name</div>
                    <div class="item-value"><%= reqObj.getEmployeeName() %></div>
                </div>
                <div class="ticket-item">
                    <div class="item-label">Department</div>
                    <div class="item-value"><%= reqObj.getDepartment() %></div>
                </div>
                <div class="ticket-item">
                    <div class="item-label">Problem Category</div>
                    <div class="item-value"><%= reqObj.getProblemCategory() %></div>
                </div>
                <div class="ticket-item">
                    <div class="item-label">Timestamp</div>
                    <div class="item-value"><%= reqObj.getSubmissionDate() %></div>
                </div>
                <div class="ticket-item">
                    <div class="item-label">SLA Turnaround</div>
                    <div class="item-value"><%= reqObj.getEstimatedResolutionTime() %></div>
                </div>
            </div>

            <div class="ticket-description-box">
                <strong>Problem Description:</strong>
                <p><%= reqObj.getProblemDescription() %></p>
            </div>

            <div class="form-actions">
                <a href="serviceRequest.jsp" class="btn btn-primary">➕ Submit Another Request</a>
            </div>
        </div>

        <!-- Q4.c & Q4.d: MVC Architecture Explanation -->
        <div class="glass-card" style="margin-top: 2rem;">
            <h2>MVC Architecture Component Mapping & Request Flow</h2>
            
            <h3>1. MVC Component Identification (Q4.c)</h3>
            <ul>
                <li><strong>Model (<code>ServiceRequest.java</code>):</strong> Encapsulates data attributes (<code>employeeId</code>, <code>employeeName</code>, <code>department</code>, <code>problemCategory</code>, <code>problemDescription</code>, <code>priority</code>, <code>requestId</code>). Does not contain HTML or presentation logic.</li>
                <li><strong>View (<code>serviceRequest.jsp</code> & <code>acknowledgement.jsp</code>):</strong> Handles presentation to the user. <code>serviceRequest.jsp</code> renders the input form, while <code>acknowledgement.jsp</code> displays ticket confirmation.</li>
                <li><strong>Controller (<code>ServiceRequestServlet.java</code>):</strong> Receives HTTP POST requests, validates input data, creates the Model object, and determines navigation by forwarding to the result view.</li>
            </ul>

            <h3>2. End-to-End Request Flow (Q4.d)</h3>
            <ol>
                <li><strong>Form Submission:</strong> The employee fills and submits <code>serviceRequest.jsp</code> via HTTP <code>POST</code>.</li>
                <li><strong>Request Interception:</strong> <code>ServiceRequestServlet.doPost()</code> intercepts the request and extracts parameters using <code>request.getParameter()</code>.</li>
                <li><strong>Validation:</strong> The Controller verifies all mandatory fields. Invalid inputs trigger a forward back to <code>serviceRequest.jsp</code> with error alerts.</li>
                <li><strong>Model Creation:</strong> Upon successful validation, the Servlet generates a unique ID (e.g. <code>SR-1001</code>) and creates a <code>ServiceRequest</code> instance.</li>
                <li><strong>Request Scope Binding:</strong> The Model is attached to the request using <code>request.setAttribute("serviceRequest", serviceRequest)</code>.</li>
                <li><strong>Request Forwarding:</strong> The Servlet forwards the request to <code>acknowledgement.jsp</code> via <code>RequestDispatcher.forward()</code>.</li>
                <li><strong>Acknowledgement Rendering:</strong> <code>acknowledgement.jsp</code> reads the attributes and displays the confirmation ticket to the employee.</li>
            </ol>
        </div>
    </main>
</body>
</html>
```

---

## How to Compile & Run on Apache Tomcat

### Directory Structure
```
CO4-AT2/
├── WEB-INF/
│   ├── web.xml
│   └── classes/
│       └── com/itservice/
│           ├── model/ServiceRequest.class
│           └── controller/ServiceRequestServlet.class
├── serviceRequest.jsp
├── acknowledgement.jsp
├── style.css
├── index.html
└── script.js
```

### Compilation Commands
```bash
# 1. Navigate to project root
cd CO4-AT2

# 2. Compile Java classes using servlet-api.jar
javac -cp ".;%CATALINA_HOME%\lib\servlet-api.jar" -d WEB-INF/classes src/com/itservice/model/ServiceRequest.java src/com/itservice/controller/ServiceRequestServlet.java

# 3. Deploy to Tomcat webapps directory:
# Copy the CO4-AT2 folder into %CATALINA_HOME%/webapps/CO4-AT2

# 4. Start Tomcat and visit in browser:
# http://localhost:8080/CO4-AT2/serviceRequest.jsp
```
