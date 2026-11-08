# To validate (V1)

Copied from `docs/reference/midan-v1-product-spec.md` sections 17 and 18. Nothing here is decided. The core problem is still a hypothesis and field validation is pending. Every screen, term, status and flow in the prototype is provisional wherever these questions apply.

## Open questions for field interviews (spec §17)

1. Which statuses and transitions do different organizations actually use, and who can change them? **[V]**
2. Is project → task enough, or are programs, phases, visits or recurring tasks needed?
3. How is evidence captured today (photos, forms, signatures, voice) and what is the minimum required to close a task?
4. How often and how long are workers offline? How should two people editing the same task be handled?
5. Which devices, screen sizes and Android versions are common? Is photo upload data cost a concern?
6. What do supervisors check first each morning? What reports must leave the system, in which format (PDF, Excel, donor/municipality formats)?
7. How are areas and locations defined (neighborhood lists, coordinates, maps)? Is a map needed early?
8. Which roles exist beyond admin / supervisor / field worker?
9. Who may see a worker's location, and what must never leave the device?
10. Is another language needed? Arabic or Western digits? Preferred month names and date format?
11. Who decides to adopt a new tool, who pays (organization, project budget, donor), and what training time is acceptable?
12. What makes teams reject a new tool? What tools are in place today and what do they fail to cover?

## Decisions that must wait until after interviews (spec §18)

- Final status list, transitions and whether a review step is default.
- The first use case and organization type to build for.
- The unit of work: task, visit, request, or something else; and the vocabulary used in the UI.
- Whether tasks can be recurring, or grouped into programs/phases.
- Minimum evidence rules and evidence types (photo, form, signature, voice).
- Conflict-resolution behavior and the real offline scope.
- Roles beyond the three in V1, and each role's data visibility.
- Map vs list for locations; worker-location visibility.
- Report formats and templates.
- Hosting model, data retention, and the privacy promises made to organizations.
- Business model, pricing and who pays.
- Team ownership, IP and contribution agreements (needed before any shared development or commercial work).
- Trademark clearance for the name and logo before public launch (none has been run).

