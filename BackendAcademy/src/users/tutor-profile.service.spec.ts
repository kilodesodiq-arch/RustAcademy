import { NotFoundException } from '@nestjs/common';
import { TutorProfileService } from './tutor-profile.service';
import { TutorSpecialty } from './interfaces/tutor-specialty.enum';

describe('TutorProfileService', () => {
  let service: TutorProfileService;

  beforeEach(() => {
    service = new TutorProfileService();
  });

  it('getEarningsSummary() returns earned XLM and payout details for a tutor', async () => {
    const profile = await service.create({
      userId: 'user-1',
      bio: 'Test tutor',
      specialties: [TutorSpecialty.WEB3_SOROBAN],
      hourlyRate: 50,
    });

    await service.updateEarnings(profile.id, 120);

    const summary = await service.getEarningsSummary(profile.id);

    expect(summary).toMatchObject({
      tutorId: profile.id,
      earnedXlm: 120,
      totalPaidOut: 0,
      pendingPayouts: 0,
      payouts: [],
    });
  });

  it('getEarningsSummary() throws when the tutor profile does not exist', async () => {
    await expect(service.getEarningsSummary('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
