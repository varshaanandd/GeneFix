def mutate_residue(pdb_path, output_path, target_residue_num, original_residue, new_residue):
    with open(pdb_path, 'r') as file:
        lines = file.readlines()

    mutated_lines = []
    for line in lines:
        if line.startswith("ATOM"):
            res_name = line[17:20].strip()
            res_num = int(line[22:26].strip())

            if res_num == target_residue_num and res_name == original_residue:
                # Replace residue name
                line = line[:17] + f"{new_residue:>3}" + line[20:]
        mutated_lines.append(line)

    with open(output_path, 'w') as file:
        file.writelines(mutated_lines)

    print(f"✅ Mutation complete: {original_residue}{target_residue_num}{new_residue} written to {output_path}")


# === Usage =
mutate_residue(
    pdb_path="static/TP53/TP53_wild.pdb",
    output_path="static/TP53/p.G12D/TP53_pg12d_missense.pdb",
    target_residue_num=12,
    original_residue="GLY",
    new_residue="ASP"
)