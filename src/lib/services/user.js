import { prisma } from "../prisma";

export const UserService = {
  async deductCredits(userId, amount) {
    return prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: amount } },
    });
  },

  async addCredits(userId, amount) {
    return prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: incrementCredits(amount) } },
    });
  },

  async getCredits(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });
    return user?.credits ?? 0;
  },
};

// Helper to ensure numeric increment
function incrementCredits(amount) {
  const val = typeof amount === "string" ? parseInt(amount, 10) : amount;
  return isNaN(val) ? 0 : val;
}
