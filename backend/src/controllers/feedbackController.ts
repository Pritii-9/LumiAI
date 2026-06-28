import { Request, Response } from 'express';
import Interview from '../models/Interview';
import { sendEmail } from '../utils/sendEmail';

// POST /api/feedback
export const saveFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interview_id, userName, userEmail, feedback, recommend } = req.body;

    if (!interview_id || !userName || !userEmail) {
      res.status(400).json({ error: 'interview_id, userName and userEmail are required.' });
      return;
    }

    const newFeedback = {
      userName,
      userEmail,
      feedback: feedback || {},
      recommend: Boolean(recommend),
      created_at: new Date().toISOString(),
    };

    const updatedInterview = await Interview.findOneAndUpdate(
      { interview_id },
      { $push: { interviewFeedback: newFeedback } },
      { new: true }
    ).lean();

    if (!updatedInterview) {
      res.status(404).json({ error: 'Interview not found.' });
      return;
    }

    res.json(updatedInterview);

    // ── Fire recruiter notification email (non-blocking) ──────────────────────
    try {
      const rating = feedback?.feedback?.rating || {};
      const scores = [rating.technicalSkills, rating.communication, rating.problemSolving, rating.experience]
        .map(Number).filter((n) => !isNaN(n) && n > 0);
      const avg = scores.length
        ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10
        : 0;
      const summary = feedback?.feedback?.summary || 'No summary available.';
      const isRecommended = Boolean(feedback?.feedback?.recommendation);
      const badgeColor = isRecommended ? '#16a34a' : '#dc2626';
      const badgeBg   = isRecommended ? '#f0fdf4' : '#fef2f2';
      const badgeText = isRecommended ? '✔ Recommended' : '✘ Not Recommended';

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f3f7fb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(15,108,189,0.10);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f6cbd,#1d4ed8);padding:32px 40px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:16px;padding:10px 24px;">
              <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">LumiAI</span>
            </div>
            <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:16px 0 4px;">New Interview Completed 🎉</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">A candidate just finished their interview</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#5f738c;font-size:14px;margin:0 0 24px;">Here's the result for <strong>${updatedInterview.jobPosition}</strong>:</p>

            <!-- Candidate card -->
            <div style="background:#f8fafc;border-radius:16px;padding:20px 24px;margin-bottom:24px;border:1px solid #e2e8f0;">
              <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#10243f;">${userName}</p>
              <p style="margin:0;font-size:13px;color:#64748b;">${userEmail}</p>
              <div style="margin-top:16px;display:flex;align-items:center;gap:16px;">
                <div style="background:#0f6cbd;color:#fff;border-radius:12px;padding:8px 18px;font-size:22px;font-weight:800;">${avg}/10</div>
                <div style="background:${badgeBg};color:${badgeColor};border:1px solid ${badgeColor}30;border-radius:100px;padding:6px 16px;font-size:13px;font-weight:600;">${badgeText}</div>
              </div>
            </div>

            <!-- Score bars -->
            <p style="font-size:13px;font-weight:600;color:#334155;margin:0 0 12px;">Skill Breakdown</p>
            ${Object.entries(rating).map(([key, val]) => `
              <div style="margin-bottom:10px;">
                <div style="display:flex;justify-content:space-between;font-size:12px;color:#64748b;margin-bottom:4px;">
                  <span style="text-transform:capitalize;">${key.replace(/([A-Z])/g, ' $1')}</span>
                  <span>${val}/10</span>
                </div>
                <div style="background:#e2e8f0;border-radius:100px;height:6px;">
                  <div style="background:#0f6cbd;border-radius:100px;height:6px;width:${(Number(val) / 10) * 100}%;"></div>
                </div>
              </div>`).join('')}

            <!-- Summary -->
            <div style="margin-top:24px;padding:16px 20px;background:#eff6ff;border-left:4px solid #0f6cbd;border-radius:0 12px 12px 0;">
              <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">${summary}</p>
            </div>

            <!-- CTA -->
            <div style="text-align:center;margin-top:28px;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/scheduled-interview/${interview_id}/details"
                style="display:inline-block;background:#0f6cbd;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:12px;font-size:14px;font-weight:600;">
                View Full Report →
              </a>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">LumiAI · AI-Powered Interview Platform · You're receiving this because a candidate completed your interview.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

      await sendEmail(
        updatedInterview.userEmail,
        `[LumiAI] ${userName} completed your ${updatedInterview.jobPosition} interview — ${avg}/10`,
        html
      );
    } catch (emailErr) {
      // Never let email failure affect the API response
      console.error('Recruiter notification email failed:', emailErr);
    }
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(503).json({ error: 'Failed to save feedback.' });
  }
};

