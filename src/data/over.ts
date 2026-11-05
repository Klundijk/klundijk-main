// Inhoud van de Over-pagina (bord X · Over, handoff v5.8). De tekst staat in teksten/over.json (bewerkbaar via het CMS).
// Levi is aanspreekpunt, niet het gezicht van het merk (besluit 30 september). Tekst over Levi en portret zijn nog te leveren
// en verschijnen alleen in dev als placeholder.
import o from './teksten/over.json';

export const over = {
  ...o,
  person: {
    ...o.person,
    bio: ((o.person as { bio?: string }).bio || null) as string | null, // nog aan te leveren door Levi of SEO & content (maximaal drie zinnen, gewone taal)
    bioPlaceholder: '[Korte tekst van Levi of SEO & content: wie hij is, waar hij vandaan komt en waarom hij dit werk doet. Maximaal drie zinnen, in gewone taal.]',
  },
};
