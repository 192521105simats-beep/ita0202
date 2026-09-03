<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes" />

    <xsl:template match="/">
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>High Enrollment Courses</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        background: #f8fafc;
                        color: #1e293b;
                        margin: 0;
                        padding: 30px;
                    }
                    .container {
                        max-width: 900px;
                        margin: 0 auto;
                        background: #ffffff;
                        padding: 25px 30px;
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                    }
                    h2 {
                        color: #1e3a8a;
                        margin-top: 0;
                        border-bottom: 2px solid #3b82f6;
                        padding-bottom: 10px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    p.subtext {
                        color: #64748b;
                        margin-bottom: 20px;
                        font-size: 14px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 15px;
                        overflow: hidden;
                        border-radius: 8px;
                    }
                    thead {
                        background-color: #1e40af;
                        color: #ffffff;
                    }
                    th, td {
                        padding: 12px 16px;
                        text-align: left;
                    }
                    th {
                        font-weight: 600;
                        font-size: 14px;
                        letter-spacing: 0.5px;
                    }
                    tbody tr {
                        border-bottom: 1px solid #e2e8f0;
                        transition: background-color 0.2s;
                    }
                    tbody tr:nth-child(even) {
                        background-color: #f8fafc;
                    }
                    tbody tr:hover {
                        background-color: #eff6ff;
                    }
                    .num {
                        text-align: right;
                        font-weight: 600;
                    }
                    .badge {
                        display: inline-block;
                        padding: 4px 10px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                    }
                    .badge-theory {
                        background: #dbeafe;
                        color: #1e40af;
                    }
                    .badge-practical {
                        background: #dcfce7;
                        color: #166534;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>High Enrollment Courses</h2>
                    <p class="subtext">Courses having student enrollment greater than 40, sorted in descending order of enrollment.</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Faculty</th>
                                <th class="num">Students</th>
                                <th class="num">Credits</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Filter courses with students > 40 and sort descending by student enrollment -->
                            <xsl:for-each select="courses/course[students &gt; 40]">
                                <xsl:sort select="students" data-type="number" order="descending" />
                                <tr>
                                    <td><strong><xsl:value-of select="code" /></strong></td>
                                    <td><xsl:value-of select="name" /></td>
                                    <td><xsl:value-of select="faculty" /></td>
                                    <td class="num"><xsl:value-of select="students" /></td>
                                    <td class="num"><xsl:value-of select="credits" /></td>
                                    <td>
                                        <span>
                                            <xsl:attribute name="class">
                                                <xsl:choose>
                                                    <xsl:when test="type = 'Theory'">badge badge-theory</xsl:when>
                                                    <xsl:otherwise>badge badge-practical</xsl:otherwise>
                                                </xsl:choose>
                                            </xsl:attribute>
                                            <xsl:value-of select="type" />
                                        </span>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
